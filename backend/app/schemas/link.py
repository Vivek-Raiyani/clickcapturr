from pydantic import BaseModel, Field, UUID4
from typing import Optional, Any, Dict
from datetime import datetime

class QRConfig(BaseModel):
    type: Optional[str] = "solid"
    color_palette: Optional[Dict[str, Any]] = None
    pattern: Optional[str] = "squares"
    shape: Optional[str] = "square"
    logo_url: Optional[str] = None
    background_image: Optional[str] = None
    gradient_direction: Optional[str] = None
    background_image_opacity: Optional[float] = 1.0

class LinkBase(BaseModel):
    page_id: Optional[UUID4] = None
    campaign_id: Optional[UUID4] = None
    qr_config: Optional[QRConfig] = None
    platform: Optional[str] = None
    platform_content_id: Optional[str] = None

class LinkCreate(LinkBase):
    pass

class LinkUpdate(BaseModel):
    page_id: Optional[UUID4] = None
    campaign_id: Optional[UUID4] = None
    qr_config: Optional[QRConfig] = None
    platform: Optional[str] = None
    platform_content_id: Optional[str] = None

class LinkResponse(LinkBase):
    id: UUID4
    user_id: UUID4
    shortcode: str
    total_clicks: int
    total_scans: int
    total_lead_captures: int
    platform_views: int
    platform_stats: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RedirectResponse(BaseModel):
    redirect_url: str
    link_id: UUID4
