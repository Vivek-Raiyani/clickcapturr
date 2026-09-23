from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

from app.schemas.link import LinkResponse

class CampaignBase(BaseModel):
    title: str
    description: Optional[str] = None
    page_id: Optional[UUID] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    page_id: Optional[UUID] = None

class CampaignResponse(CampaignBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    total_visits: int
    total_lead_captures: int
    links: List[LinkResponse] = []

    class Config:
        from_attributes = True
