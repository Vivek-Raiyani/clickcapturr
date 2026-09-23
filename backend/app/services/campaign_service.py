import logging
import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update

from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate

logger = logging.getLogger(__name__)

class CampaignService:
    async def create_campaign(
        self, db: AsyncSession, user_id: UUID, campaign_in: CampaignCreate
    ) -> Campaign:
        logger.info("Creating campaign for user_id='%s'", user_id)
        
        db_campaign = Campaign(
            **campaign_in.model_dump(),
            user_id=user_id,
        )
        db.add(db_campaign)
        await db.commit()
        await db.refresh(db_campaign)

        logger.info("Campaign created successfully: id='%s'", db_campaign.id)
        return db_campaign

    async def get_campaigns_for_user(
        self, db: AsyncSession, user_id: UUID
    ) -> list[Campaign]:
        logger.debug("Fetching campaigns for user_id='%s'", user_id)

        query = select(Campaign).where(
            Campaign.user_id == user_id,
            Campaign.is_deleted == False,
        )

        result = await db.execute(query)
        campaigns = list(result.scalars().all())

        return campaigns

    async def get_campaign_by_id(
        self,
        db: AsyncSession,
        campaign_id: UUID,
        user_id: UUID | None = None,
    ) -> Campaign | None:
        logger.debug("Fetching campaign id='%s'", campaign_id)

        query = select(Campaign).where(
            Campaign.id == campaign_id,
            Campaign.is_deleted == False,
        )
        if user_id:
            query = query.where(Campaign.user_id == user_id)

        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def update_campaign(
        self,
        db: AsyncSession,
        campaign_id: UUID,
        user_id: UUID,
        campaign_in: CampaignUpdate,
    ) -> Campaign | None:
        logger.info("Updating campaign id='%s' for user_id='%s'", campaign_id, user_id)

        db_campaign = await self.get_campaign_by_id(db, campaign_id, user_id)
        if not db_campaign:
            return None

        update_data = campaign_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_campaign, key, value)

        await db.commit()
        await db.refresh(db_campaign)

        return db_campaign

    async def delete_campaign(
        self, db: AsyncSession, campaign_id: UUID, user_id: UUID
    ) -> bool:
        logger.info("Soft-deleting campaign id='%s' for user_id='%s'", campaign_id, user_id)

        db_campaign = await self.get_campaign_by_id(db, campaign_id, user_id)
        if not db_campaign:
            return False

        db_campaign.is_deleted = True
        db_campaign.deleted_at = datetime.datetime.now(datetime.timezone.utc)
        await db.commit()

        return True

    async def nullify_page_id(
        self, db: AsyncSession, page_id: UUID
    ):
        """When a page is soft-deleted, remove its association from any campaigns."""
        await db.execute(
            update(Campaign)
            .where(Campaign.page_id == page_id)
            .values(page_id=None)
        )
        await db.commit()

campaign_service = CampaignService()
