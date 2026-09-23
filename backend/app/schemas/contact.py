"""
contact.py — Pydantic schemas for the contacts / lead-capture system.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime


# ---------------------------------------------------------------------------
# Sub-schemas
# ---------------------------------------------------------------------------

class LocationInfo(BaseModel):
    """
    Location resolved client-side (via IP-geo lookup on the public page).
    Only country is required; state/city are best-effort.
    """
    country:      Optional[str] = None   # ISO-3166-1 alpha-2 e.g. "IN"
    country_name: Optional[str] = None   # e.g. "India"
    state:        Optional[str] = None   # e.g. "Maharashtra"
    city:         Optional[str] = None   # e.g. "Mumbai"


# ---------------------------------------------------------------------------
# Inbound — what the public submit endpoint receives
# ---------------------------------------------------------------------------

class ContactSubmitPayload(BaseModel):
    """
    Posted by the frontend when a visitor submits any landing-page form.

    ``fields``   — raw key→value dump of all form inputs (field id → value).
    ``location`` — country/state/city resolved by the browser before submit.
    ``link_id``  — optional; set when the visitor arrived via a tracked link.
    ``campaign_id`` — optional; denormalised from the link for fast filtering.
    """
    fields:      Dict[str, Any]          = Field(default_factory=dict)
    location:    Optional[LocationInfo]  = None
    link_id:     Optional[UUID]          = None
    campaign_id: Optional[UUID]          = None


# ---------------------------------------------------------------------------
# Outbound — what the API returns
# ---------------------------------------------------------------------------

class ContactResponse(BaseModel):
    """Flat contact-person record."""
    id:         UUID
    email:      Optional[str]
    first_name: Optional[str]
    last_name:  Optional[str]
    phone:      Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContactLinkResponse(BaseModel):
    """
    One submission event — contact fields are flattened in for easy
    table display in the Leads tab.
    """
    # --- event identity ---
    id:          UUID
    page_id:     UUID
    contact_id:  UUID
    link_id:     Optional[UUID]
    campaign_id: Optional[UUID]
    created_at:  datetime

    # --- contact person (flattened) ---
    email:      Optional[str]
    first_name: Optional[str]
    last_name:  Optional[str]
    phone:      Optional[str]

    # --- page & campaign ---
    page_name:  Optional[str] = None
    campaign_name: Optional[str] = None

    # --- raw payload ---
    data_json:  Optional[Dict[str, Any]]

    # --- location ---
    country:      Optional[str]
    country_name: Optional[str]
    state:        Optional[str]
    city:         Optional[str]

    class Config:
        from_attributes = True


class ContactSubmitResponse(BaseModel):
    success:    bool
    contact_id: UUID
