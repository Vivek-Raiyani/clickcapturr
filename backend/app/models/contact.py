"""
contact.py
----------
Two-table design for lead / contact capture.

``Contact``     — one row per unique person (deduplicated by email).
``ContactLink`` — one row per form-submission event; links a contact
                  to the page, campaign, and traffic source.

Upsert pattern
--------------
  1. Look up Contact by email.
  2. If found  → reuse id; patch any blank fields (name, phone).
  3. If missing → insert a new Contact row.
  4. Always insert a new ContactLink row (the submission event).
  5. Increment Page.total_lead_captures.
"""

from sqlalchemy import Column, String, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from app.models.base import Base


class Contact(Base):
    """
    Deduplicated person record.
    One row per unique person across ALL pages / campaigns.
    """
    __tablename__ = "contacts"

    # ---------- Identity -----------------------------------------------
    email      = Column(String, nullable=True, index=True, unique=True)
    first_name = Column(String, nullable=True)
    last_name  = Column(String, nullable=True)
    phone      = Column(String, nullable=True)

    # ---------- Relationships ------------------------------------------
    submissions = relationship(
        "ContactLink",
        back_populates="contact",
        cascade="all, delete-orphan",
        lazy="select",
    )


class ContactLink(Base):
    """
    Per-submission event record.
    One row every time a person submits a form — even if they already
    exist in the contacts table (same person, different page).
    """
    __tablename__ = "contact_links"

    # ---------- Foreign keys ------------------------------------------
    contact_id  = Column(
        ForeignKey("contacts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    page_id     = Column(
        ForeignKey("pages.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    link_id     = Column(
        ForeignKey("links.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    campaign_id = Column(
        ForeignKey("campaigns.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ---------- Submission payload -------------------------------------
    data_json  = Column(JSON, nullable=True)   # raw key→value form dump

    # ---------- Location (resolved client-side) -----------------------
    country      = Column(String(2),  nullable=True)   # ISO-3166-1 alpha-2
    country_name = Column(String,     nullable=True)
    state        = Column(String,     nullable=True)
    city         = Column(String,     nullable=True)

    # ---------- Device / session metadata ----------------------------
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)

    # ---------- Relationships ----------------------------------------
    contact  = relationship("Contact",  back_populates="submissions")
    page     = relationship("Page")
    link     = relationship("Link")
    campaign = relationship("Campaign")

    # ---------- Composite indexes ------------------------------------
    __table_args__ = (
        Index("ix_contact_links_page_contact", "page_id", "contact_id"),
        Index("ix_contact_links_campaign",     "campaign_id"),
    )
