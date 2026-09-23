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
from datetime import datetime
from collections import Counter
import xlsxwriter

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
    # EXPORT — EXCEL stream
    # -----------------------------------------------------------------------

    def _create_excel_workbook(self, rows: List[ContactLink]) -> bytes:
        buf = io.BytesIO()
        workbook = xlsxwriter.Workbook(buf, {'in_memory': True})
        worksheet = workbook.add_worksheet('Contacts')
        
        bold = workbook.add_format({'bold': True})
        
        headers = [
            "page", "campaign",
            "first_name", "last_name", "email", "phone",
            "country", "state", "city",
            "submitted_at", "method"
        ]
        
        for col_num, header in enumerate(headers):
            worksheet.write(0, col_num, header, bold)
            
        page_counts = Counter()
        location_counts = Counter()
        campaign_counts = Counter()
        
        for row_num, row in enumerate(rows, 1):
            c = row.contact
            data_json = row.data_json or {}
            method = data_json.get("_method") or ("click" if row.link_id else "direct")
            
            page_name = row.page.name if row.page else ""
            campaign_name = row.campaign.title if row.campaign else ""
            country = row.country or ""
            
            if page_name: page_counts[page_name] += 1
            if country: location_counts[country] += 1
            if campaign_name: campaign_counts[campaign_name] += 1
            
            record = [
                page_name,
                campaign_name,
                c.first_name if c else "",
                c.last_name if c else "",
                c.email if c else "",
                c.phone if c else "",
                country,
                row.state or "",
                row.city or "",
                row.created_at.isoformat(),
                method
            ]
            
            for col_num, item in enumerate(record):
                worksheet.write(row_num, col_num, item)

        worksheet.set_column('A:K', 15)

        summary_row = 1
        
        def add_chart(counts, title, col_offset):
            nonlocal summary_row
            if not counts: return
            
            start_row = summary_row
            worksheet.write(start_row, 15 + col_offset, title, bold)
            
            # Limit to top 10 for charts
            for i, (name, count) in enumerate(counts.most_common(10)):
                worksheet.write(start_row + 1 + i, 15 + col_offset, name)
                worksheet.write(start_row + 1 + i, 16 + col_offset, count)
                
            end_row = start_row + min(10, len(counts))
            if end_row > start_row:
                chart = workbook.add_chart({'type': 'column'})
                chart.add_series({
                    'categories': ['Contacts', start_row + 1, 15 + col_offset, end_row, 15 + col_offset],
                    'values':     ['Contacts', start_row + 1, 16 + col_offset, end_row, 16 + col_offset],
                    'name': title,
                })
                chart.set_title({'name': title})
                chart.set_legend({'none': True})
                chart.show_hidden_data()
                
                # Insert chart starting from column M (12)
                worksheet.insert_chart(start_row, 12 + int(col_offset/3) * 8, chart)
                
                summary_row = max(summary_row, end_row + 2)

        add_chart(page_counts, 'Page vs Contacts', 0)
        add_chart(location_counts, 'Location vs Contacts', 3)
        add_chart(campaign_counts, 'Campaign vs Contacts', 6)

        # Hide the summary data columns
        worksheet.set_column(15, 30, None, None, {'hidden': True})
        
        workbook.close()
        return buf.getvalue()

    async def export_excel(
        self, db: AsyncSession, page_id: UUID, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None
    ) -> bytes:
        """
        Build and return an Excel workbook of all submissions for a page.
        """
        query = (
            select(ContactLink)
            .where(ContactLink.page_id == page_id)
            .options(
                selectinload(ContactLink.contact),
                selectinload(ContactLink.page),
                selectinload(ContactLink.campaign)
            )
        )
        if start_date:
            query = query.where(ContactLink.created_at >= start_date)
        if end_date:
            query = query.where(ContactLink.created_at <= end_date)
            
        query = query.order_by(ContactLink.created_at.desc())
        
        result = await db.execute(query)
        rows = list(result.scalars().all())

        return self._create_excel_workbook(rows)

    async def export_user_excel(
        self,
        db: AsyncSession,
        user_id: UUID,
        page_id: Optional[UUID] = None,
        campaign_id: Optional[UUID] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> bytes:
        """
        Build and return an Excel workbook of submissions for a user, optionally filtered.
        """
        query = (
            select(ContactLink)
            .join(Page, ContactLink.page_id == Page.id)
            .where(Page.user_id == user_id, Page.is_deleted == False)
        )

        if page_id:
            query = query.where(ContactLink.page_id == page_id)
        if campaign_id:
            query = query.where(ContactLink.campaign_id == campaign_id)
        if start_date:
            query = query.where(ContactLink.created_at >= start_date)
        if end_date:
            query = query.where(ContactLink.created_at <= end_date)

        query = query.options(
            selectinload(ContactLink.contact),
            selectinload(ContactLink.page),
            selectinload(ContactLink.campaign)
        ).order_by(ContactLink.created_at.desc())

        result = await db.execute(query)
        rows = list(result.scalars().all())

        return self._create_excel_workbook(rows)


# Module-level singleton
contact_service = ContactService()
