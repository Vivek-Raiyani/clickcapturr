from sqlalchemy import Column, String, JSON, ForeignKey, Integer, CheckConstraint
from sqlalchemy.orm import relationship
from app.models.base import Base, SoftDeleteMixin

class Link(SoftDeleteMixin, Base):
    __tablename__ = "links"

    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    page_id = Column(ForeignKey("pages.id", ondelete="CASCADE"), nullable=True, index=True)
    campaign_id = Column(ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=True, index=True)
    
    shortcode = Column(String, unique=True, index=True, nullable=False)
    label = Column(String, nullable=True)  # e.g. "YouTube Video 1", "Instagram Bio"
    
    total_clicks = Column(Integer, default=0)
    total_scans = Column(Integer, default=0)
    total_lead_captures = Column(Integer, default=0)
    
    qr_config = Column(JSON, nullable=True)
    
    platform = Column(String, nullable=True)
    platform_content_id = Column(String, nullable=True)
    platform_views = Column(Integer, default=0)
    platform_stats = Column(JSON, nullable=True)

    user = relationship("User")
    page = relationship("Page", back_populates="link")
    campaign = relationship("Campaign", back_populates="links")

    __table_args__ = (
        CheckConstraint(
            'page_id IS NOT NULL OR campaign_id IS NOT NULL',
            name='check_page_or_campaign_present'
        ),
    )
