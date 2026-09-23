from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

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

    class Config:
        from_attributes = True
