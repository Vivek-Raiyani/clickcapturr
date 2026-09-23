from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.models.user import User
from app.schemas.response import DataResponse, MessageResponse
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse
from app.services.campaign_service import campaign_service
from app.services.page_service import page_service

router = APIRouter()

@router.post("/", response_model=DataResponse[CampaignResponse])
async def create_campaign(
    campaign_in: CampaignCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    if campaign_in.page_id:
        page = await page_service.get_page_by_id(db, campaign_in.page_id, current_user.id)
        if not page:
            raise HTTPException(status_code=400, detail="Page not found or not owned by user")
            
    campaign = await campaign_service.create_campaign(db, current_user.id, campaign_in)
    return DataResponse(data=campaign)

@router.get("/", response_model=DataResponse[List[CampaignResponse]])
async def get_my_campaigns(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    campaigns = await campaign_service.get_campaigns_for_user(db, current_user.id)
    return DataResponse(data=campaigns)

@router.get("/{campaign_id}", response_model=DataResponse[CampaignResponse])
async def get_campaign(
    campaign_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    campaign = await campaign_service.get_campaign_by_id(db, campaign_id, current_user.id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return DataResponse(data=campaign)

@router.put("/{campaign_id}", response_model=DataResponse[CampaignResponse])
async def update_campaign(
    campaign_id: UUID,
    campaign_in: CampaignUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    if campaign_in.page_id:
        page = await page_service.get_page_by_id(db, campaign_in.page_id, current_user.id)
        if not page:
            raise HTTPException(status_code=400, detail="Page not found or not owned by user")
            
    campaign = await campaign_service.update_campaign(db, campaign_id, current_user.id, campaign_in)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return DataResponse(data=campaign)

@router.delete("/{campaign_id}", response_model=MessageResponse)
async def delete_campaign(
    campaign_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    success = await campaign_service.delete_campaign(db, campaign_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return MessageResponse(message="Campaign deleted successfully")
