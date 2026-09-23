from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.models.base import Base, SoftDeleteMixin
from sqlalchemy.dialects.postgresql import UUID

class Campaign(SoftDeleteMixin, Base):
    __tablename__ = "campaigns"

    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    page_id = Column(ForeignKey("pages.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    total_visits = Column(Integer, default=0)
    total_lead_captures = Column(Integer, default=0)

    user = relationship("User")
    page = relationship("Page")
    links = relationship("Link", back_populates="campaign", cascade="all, delete-orphan", lazy="selectin")
