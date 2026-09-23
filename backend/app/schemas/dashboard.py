from pydantic import BaseModel
from typing import List
from app.schemas.campaign import CampaignResponse
from app.schemas.page import PageResponse
from app.schemas.contact import ContactLinkResponse

class DashboardStatsResponse(BaseModel):
    total_page_views: int
    total_contacts: int
    active_campaigns: int
    conversion_rate: float
    recent_campaigns: List[CampaignResponse]
    recent_pages: List[PageResponse]
    recent_contacts: List[ContactLinkResponse]
