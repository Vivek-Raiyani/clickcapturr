"""
contacts.py — API routes for the lead / contact-capture system.

Public endpoints (no auth):
  POST /contacts/submit/{page_id}

Authenticated endpoints (page owner only):
  GET  /contacts/page/{page_id}
  GET  /contacts/page/{page_id}/export
"""

from uuid import UUID
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.models.page import Page
from app.models.user import User
from app.models.contact import ContactLink
from app.schemas.contact import (
    ContactSubmitPayload,
    ContactLinkResponse,
    ContactSubmitResponse,
)
from app.schemas.response import DataResponse
from app.services.contact_service import contact_service

router = APIRouter()


# ---------------------------------------------------------------------------
# Public — form submission
# ---------------------------------------------------------------------------

@router.post(
    "/submit/{page_id}",
    response_model=ContactSubmitResponse,
    summary="Submit a form on a public landing page",
)
async def submit_form(
    page_id: UUID,
    payload: ContactSubmitPayload,
    request: Request,
    db: AsyncSession = Depends(deps.get_db),
):
    """
    Called by the frontend when a visitor submits any landing-page form.
    No authentication required.
    """
    # Verify the page exists (soft-delete-safe)
    result = await db.execute(
        select(Page).where(Page.id == page_id, Page.is_deleted == False)
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    link_event = await contact_service.submit(db, page_id, payload, request)

    return ContactSubmitResponse(
        success=True,
        contact_id=link_event.contact_id,
    )


# ---------------------------------------------------------------------------
# Authenticated — list all submissions for user
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=DataResponse[List[ContactLinkResponse]],
    summary="List all form submissions across all pages for the authenticated user",
)
async def list_all_submissions(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Returns all ContactLink (submission event) rows across all pages owned by the user.
    """
    events = await contact_service.list_for_user(db, current_user.id)

    response_items = [
        ContactLinkResponse(
            id=e.id,
            page_id=e.page_id,
            contact_id=e.contact_id,
            link_id=e.link_id,
            campaign_id=e.campaign_id,
            created_at=e.created_at,
            email=e.contact.email if e.contact else None,
            first_name=e.contact.first_name if e.contact else None,
            last_name=e.contact.last_name if e.contact else None,
            phone=e.contact.phone if e.contact else None,
            page_name=e.page.name if e.page else None,
            campaign_name=e.campaign.title if e.campaign else None,
            data_json=e.data_json,
            country=e.country,
            country_name=e.country_name,
            state=e.state,
            city=e.city,
        )
        for e in events
    ]

    return DataResponse(data=response_items)


# ---------------------------------------------------------------------------
# Authenticated — list submissions for a page
# ---------------------------------------------------------------------------

@router.get(
    "/page/{page_id}",
    response_model=DataResponse[List[ContactLinkResponse]],
    summary="List all form submissions for a page",
)
async def list_submissions(
    page_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Returns all ContactLink (submission event) rows for a page,
    newest first, with contact details flattened.
    Owner-scoped: the page must belong to the authenticated user.
    """
    # Verify ownership
    page_result = await db.execute(
        select(Page).where(
            Page.id == page_id,
            Page.user_id == current_user.id,
            Page.is_deleted == False,
        )
    )
    if not page_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Page not found")

    events = await contact_service.list_for_page(db, page_id)

    response_items = [
        ContactLinkResponse(
            id=e.id,
            page_id=e.page_id,
            contact_id=e.contact_id,
            link_id=e.link_id,
            campaign_id=e.campaign_id,
            created_at=e.created_at,
            email=e.contact.email if e.contact else None,
            first_name=e.contact.first_name if e.contact else None,
            last_name=e.contact.last_name if e.contact else None,
            phone=e.contact.phone if e.contact else None,
            page_name=e.page.name if e.page else None,
            campaign_name=e.campaign.title if e.campaign else None,
            data_json=e.data_json,
            country=e.country,
            country_name=e.country_name,
            state=e.state,
            city=e.city,
        )
        for e in events
    ]

    return DataResponse(data=response_items)


# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Authenticated — EXCEL export
# ---------------------------------------------------------------------------

@router.get(
    "/page/{page_id}/export",
    summary="Export all form submissions as Excel",
)
async def export_leads_excel(
    page_id: UUID,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Streams an Excel file of submission events for a page.
    """
    # Verify ownership
    page_result = await db.execute(
        select(Page).where(
            Page.id == page_id,
            Page.user_id == current_user.id,
            Page.is_deleted == False,
        )
    )
    page = page_result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    excel_bytes = await contact_service.export_excel(db, page_id, start_date, end_date)

    filename = f"leads-{page.slug}.xlsx"
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get(
    "/export",
    summary="Export all form submissions as Excel, optionally filtered",
)
async def export_all_leads_excel(
    page_id: Optional[UUID] = None,
    campaign_id: Optional[UUID] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Streams an Excel file of submission events for the authenticated user.
    """
    excel_bytes = await contact_service.export_user_excel(db, current_user.id, page_id, campaign_id, start_date, end_date)

    filename = "all-contacts.xlsx"
    if page_id:
        # Fetch page to get name or slug if needed, but for simplicity using ID
        filename = f"page-contacts.xlsx"
    elif campaign_id:
        filename = f"campaign-contacts.xlsx"

    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
