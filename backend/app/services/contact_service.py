"""
contact_service.py
------------------
Business logic for the two-table contact / lead-capture system.

Upsert pattern
--------------
submit()
  1. Extract well-known fields (email, first_name, last_name, phone)
     from the raw form payload using heuristic label matching.
  2. Look up Contact by email (if present).
     - Found  → reuse the row; patch any blank fields.
     - Missing → insert new Contact.
  3. Always insert a new ContactLink (the submission event).
  4. Increment Page.total_lead_captures.
"""

import logging
import io
import csv
from typing import Optional, List
from uuid import UUID

from fastapi import Request
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.contact import Contact, ContactLink
from app.models.page import Page
from app.schemas.contact import ContactSubmitPayload

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Heuristic field-name normalisation
# ---------------------------------------------------------------------------

_FIRST_NAME_KEYS = {"first_name", "firstname", "first", "fname", "f-name", "f_name", "name"}
_LAST_NAME_KEYS  = {"last_name",  "lastname",  "last",  "lname", "l-name", "l_name", "surname"}
_EMAIL_KEYS      = {"email", "email_address", "emailaddress", "f-email"}
_PHONE_KEYS      = {"phone", "phone_number", "phonenumber", "mobile", "tel", "telephone"}


def _extract(fields: dict, keys: set) -> Optional[str]:
    """Return the first value whose lower-cased key appears in *keys*."""
    for k, v in fields.items():
        if k.lower().replace("-", "_") in keys and v:
            return str(v).strip() or None
    return None


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------

class ContactService:

    # -----------------------------------------------------------------------
    # WRITE
    # -----------------------------------------------------------------------

    async def submit(
        self,
        db:      AsyncSession,
        page_id: UUID,
        payload: ContactSubmitPayload,
        request: Optional[Request] = None,
    ) -> ContactLink:
        """
        Upsert the Contact then insert a ContactLink event row.
        Returns the newly created ContactLink.
        """
        fields = payload.fields or {}

        # --- Extract well-known fields from the raw form dump ---
        email      = _extract(fields, _EMAIL_KEYS)
        first_name = _extract(fields, _FIRST_NAME_KEYS)
        last_name  = _extract(fields, _LAST_NAME_KEYS)
        phone      = _extract(fields, _PHONE_KEYS)

        # --- Upsert Contact ---
        contact: Optional[Contact] = None

        if email:
            result = await db.execute(
                select(Contact).where(Contact.email == email)
            )
            contact = result.scalar_one_or_none()

        if contact:
            # Patch blank fields without overwriting existing data
            changed = False
            if not contact.first_name and first_name:
                contact.first_name = first_name; changed = True
            if not contact.last_name  and last_name:
                contact.last_name  = last_name;  changed = True
            if not contact.phone      and phone:
                contact.phone      = phone;      changed = True
            if changed:
                await db.flush()
        else:
            contact = Contact(
                email=email,
                first_name=first_name,
                last_name=last_name,
                phone=phone,
            )
            db.add(contact)
            await db.flush()   # generate contact.id before using it below

        # --- Resolve IP / user-agent from request ---
        ip_address: Optional[str] = None
        user_agent: Optional[str] = None
        if request:
            forwarded = request.headers.get("x-forwarded-for")
            ip_address = (
                forwarded.split(",")[0].strip() if forwarded
                else (request.client.host if request.client else None)
            )
            user_agent = request.headers.get("user-agent")

        # --- Insert ContactLink event ---
        loc = payload.location
        link_event = ContactLink(
            contact_id=contact.id,
            page_id=page_id,
            link_id=payload.link_id,
            campaign_id=payload.campaign_id,
            data_json=fields,
            country=loc.country           if loc else None,
            country_name=loc.country_name if loc else None,
            state=loc.state               if loc else None,
            city=loc.city                 if loc else None,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        db.add(link_event)

        # --- Increment page lead counter ---
        await db.execute(
            update(Page)
            .where(Page.id == page_id)
            .values(total_lead_captures=Page.total_lead_captures + 1)
        )

        await db.commit()
        await db.refresh(link_event)

        logger.info(
            "Form submitted: page_id=%s contact_id=%s event_id=%s",
            page_id, link_event.contact_id, link_event.id,
        )
        return link_event

    # -----------------------------------------------------------------------
    # READ — list for page (authenticated, owner-scoped in route layer)
    # -----------------------------------------------------------------------

    async def list_for_page(
        self, db: AsyncSession, page_id: UUID
    ) -> List[ContactLink]:
        """
        Return all ContactLink rows for a page, newest first,
        with the parent Contact eagerly loaded.
        """
        result = await db.execute(
            select(ContactLink)
            .where(ContactLink.page_id == page_id)
            .options(
                selectinload(ContactLink.contact),
                selectinload(ContactLink.page),
                selectinload(ContactLink.campaign)
            )
            .order_by(ContactLink.created_at.desc())
        )
        return list(result.scalars().all())

    async def list_for_user(
        self, db: AsyncSession, user_id: UUID
    ) -> List[ContactLink]:
        """
        Return all ContactLink rows across all pages owned by a user.
        """
        result = await db.execute(
            select(ContactLink)
            .join(Page, ContactLink.page_id == Page.id)
            .where(Page.user_id == user_id, Page.is_deleted == False)
            .options(
                selectinload(ContactLink.contact),
                selectinload(ContactLink.page),
                selectinload(ContactLink.campaign)
            )
            .order_by(ContactLink.created_at.desc())
        )
        return list(result.scalars().all())

    # -----------------------------------------------------------------------
    # EXPORT — CSV stream
    # -----------------------------------------------------------------------

    async def export_csv(
        self, db: AsyncSession, page_id: UUID
    ) -> bytes:
        """
        Build and return a UTF-8 CSV of all submissions for a page.
        Collects all unique field keys from data_json across all rows
        so every custom field gets its own column.
        """
        rows = await self.list_for_page(db, page_id)

        # Gather the superset of custom field names
        custom_keys: list[str] = []
        seen: set[str] = set()
        for row in rows:
            for k in (row.data_json or {}).keys():
                if k not in seen:
                    seen.add(k)
                    custom_keys.append(k)

        fixed_cols = [
            "submission_id", "contact_id",
            "first_name", "last_name", "email", "phone",
            "country", "state", "city",
            "submitted_at",
        ]
        all_cols = fixed_cols + custom_keys

        buf = io.StringIO()
        writer = csv.DictWriter(buf, fieldnames=all_cols, extrasaction="ignore")
        writer.writeheader()

        for row in rows:
            c = row.contact
            record: dict = {
                "submission_id": str(row.id),
                "contact_id":    str(row.contact_id),
                "first_name":    c.first_name  if c else "",
                "last_name":     c.last_name   if c else "",
                "email":         c.email       if c else "",
                "phone":         c.phone       if c else "",
                "country":       row.country      or "",
                "state":         row.state        or "",
                "city":          row.city         or "",
                "submitted_at":  row.created_at.isoformat(),
            }
            for k in custom_keys:
                record[k] = (row.data_json or {}).get(k, "")
            writer.writerow(record)

        return buf.getvalue().encode("utf-8")


# Module-level singleton
contact_service = ContactService()
