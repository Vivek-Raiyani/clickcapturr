from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.campaign import Campaign
from app.models.page import Page
from app.models.contact import ContactLink, Contact
from app.schemas.dashboard import DashboardStatsResponse
from app.schemas.contact import ContactLinkResponse

class DashboardService:
    async def get_dashboard_stats(self, db: AsyncSession, user_id: UUID) -> DashboardStatsResponse:
        # 1. Total Page Views
        # Sum of total_visits on all pages owned by user
        stmt_views = select(func.sum(Page.total_visits)).where(Page.user_id == user_id, Page.is_deleted == False)
        result_views = await db.execute(stmt_views)
        total_page_views = result_views.scalar() or 0

        # 2. Total Contacts
        # Sum of total_lead_captures on all pages owned by user
        stmt_contacts = select(func.sum(Page.total_lead_captures)).where(Page.user_id == user_id, Page.is_deleted == False)
        result_contacts = await db.execute(stmt_contacts)
        total_contacts = result_contacts.scalar() or 0

        # 3. Active Campaigns
        stmt_campaigns = select(func.count(Campaign.id)).where(Campaign.user_id == user_id, Campaign.is_deleted == False)
        result_campaigns = await db.execute(stmt_campaigns)
        active_campaigns = result_campaigns.scalar() or 0

        # Conversion Rate
        conversion_rate = 0.0
        if total_page_views > 0:
            conversion_rate = (total_contacts / total_page_views) * 100

        # 4. Recent Campaigns
        stmt_recent_c = select(Campaign).where(
            Campaign.user_id == user_id, Campaign.is_deleted == False
        ).order_by(Campaign.created_at.desc()).limit(3).options(selectinload(Campaign.links))
        result_recent_c = await db.execute(stmt_recent_c)
        recent_campaigns = result_recent_c.scalars().all()

        # 5. Recent Pages
        stmt_recent_p = select(Page).where(
            Page.user_id == user_id, Page.is_deleted == False
        ).order_by(Page.created_at.desc()).limit(3).options(selectinload(Page.link))
        result_recent_p = await db.execute(stmt_recent_p)
        recent_pages = result_recent_p.scalars().all()

        # 6. Recent Contacts
        # Get recent ContactLinks for pages owned by user
        stmt_recent_cl = select(ContactLink, Contact, Page.name.label("page_name"), Campaign.title.label("campaign_name"))\
            .join(Contact, ContactLink.contact_id == Contact.id)\
            .join(Page, ContactLink.page_id == Page.id)\
            .outerjoin(Campaign, ContactLink.campaign_id == Campaign.id)\
            .where(Page.user_id == user_id)\
            .order_by(ContactLink.created_at.desc())\
            .limit(5)
            
        result_recent_cl = await db.execute(stmt_recent_cl)
        rows = result_recent_cl.all()
        
        recent_contacts_response = []
        for cl, contact, page_name, campaign_name in rows:
            recent_contacts_response.append(ContactLinkResponse(
                id=cl.id,
                page_id=cl.page_id,
                contact_id=cl.contact_id,
                link_id=cl.link_id,
                campaign_id=cl.campaign_id,
                created_at=cl.created_at,
                email=contact.email,
                first_name=contact.first_name,
                last_name=contact.last_name,
                phone=contact.phone,
                page_name=page_name,
                campaign_name=campaign_name,
                data_json=cl.data_json,
                country=cl.country,
                country_name=cl.country_name,
                state=cl.state,
                city=cl.city
            ))

        return DashboardStatsResponse(
            total_page_views=total_page_views,
            total_contacts=total_contacts,
            active_campaigns=active_campaigns,
            conversion_rate=round(conversion_rate, 2),
            recent_campaigns=list(recent_campaigns),
            recent_pages=list(recent_pages),
            recent_contacts=recent_contacts_response
        )

dashboard_service = DashboardService()
