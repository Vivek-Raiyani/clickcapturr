import string
import random
from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update

from app.models.link import Link
from app.models.page import Page
from app.models.campaign import Campaign
from app.schemas.link import LinkCreate, LinkUpdate

class LinkService:
    def _generate_shortcode(self, length=6) -> str:
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for _ in range(length))

    async def _generate_unique_shortcode(self, db: AsyncSession, length=6) -> str:
        for _ in range(10): # try 10 times
            code = self._generate_shortcode(length)
            stmt = select(Link).where(Link.shortcode == code)
            result = await db.execute(stmt)
            if not result.scalars().first():
                return code
        raise Exception("Failed to generate unique shortcode")

    async def create_link(self, db: AsyncSession, user_id: UUID, link_in: LinkCreate) -> Link:
        shortcode = await self._generate_unique_shortcode(db)
        
        link = Link(
            user_id=user_id,
            page_id=link_in.page_id,
            campaign_id=link_in.campaign_id,
            shortcode=shortcode,
            qr_config=link_in.qr_config.model_dump() if link_in.qr_config else None,
            platform=link_in.platform,
            platform_content_id=link_in.platform_content_id
        )
        db.add(link)
        await db.commit()
        await db.refresh(link)
        return link

    async def get_links_for_user(self, db: AsyncSession, user_id: UUID) -> List[Link]:
        stmt = select(Link).where(Link.user_id == user_id, Link.is_deleted == False).order_by(Link.created_at.desc())
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def get_link_by_id(self, db: AsyncSession, link_id: UUID, user_id: UUID) -> Optional[Link]:
        stmt = select(Link).where(Link.id == link_id, Link.user_id == user_id, Link.is_deleted == False)
        result = await db.execute(stmt)
        return result.scalars().first()

    async def update_link(self, db: AsyncSession, link_id: UUID, user_id: UUID, link_in: LinkUpdate) -> Optional[Link]:
        link = await self.get_link_by_id(db, link_id, user_id)
        if not link:
            return None

        update_data = link_in.model_dump(exclude_unset=True)
        if "qr_config" in update_data and update_data["qr_config"]:
             update_data["qr_config"] = update_data["qr_config"]

        for field, value in update_data.items():
            setattr(link, field, value)
            
        await db.commit()
        await db.refresh(link)
        return link

    async def delete_link(self, db: AsyncSession, link_id: UUID, user_id: UUID) -> bool:
        link = await self.get_link_by_id(db, link_id, user_id)
        if not link:
            return False
            
        link.is_deleted = True
        await db.commit()
        return True

    async def process_redirect(self, db: AsyncSession, code: str) -> Optional[dict]:
        # Try normal click
        stmt = select(Link).where(Link.shortcode == code, Link.is_deleted == False)
        result = await db.execute(stmt)
        link = result.scalars().first()
        is_scan = False

        if not link:
            # Try reverse scan
            reversed_code = code[::-1]
            stmt = select(Link).where(Link.shortcode == reversed_code, Link.is_deleted == False)
            result = await db.execute(stmt)
            link = result.scalars().first()
            is_scan = True

        if not link:
            return None

        # Increment Link stats
        if is_scan:
            link.total_scans += 1
        else:
            link.total_clicks += 1

        redirect_url = ""
        page_id = link.page_id
        
        # Get target url and increment page/campaign visits
        if link.campaign_id:
            stmt = select(Campaign).where(Campaign.id == link.campaign_id, Campaign.is_deleted == False)
            res = await db.execute(stmt)
            campaign = res.scalars().first()
            if campaign:
                campaign.total_visits += 1
                page_id = campaign.page_id
                
        if page_id:
            stmt = select(Page).where(Page.id == page_id, Page.is_deleted == False)
            res = await db.execute(stmt)
            page = res.scalars().first()
            if page:
                page.total_visits += 1
                redirect_url = f"/public/{page.slug}"
                if link.campaign_id:
                    redirect_url += f"?campaign_id={link.campaign_id}"

        link_id = link.id
        await db.commit()
        
        if not redirect_url:
             return None # Incomplete setup
             
        return {
            "redirect_url": redirect_url,
            "link_id": link_id
        }

link_service = LinkService()
