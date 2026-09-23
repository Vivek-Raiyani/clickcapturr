from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base, SoftDeleteMixin
from sqlalchemy.dialects.postgresql import UUID

class Campaign(SoftDeleteMixin, Base):
    __tablename__ = "campaigns"

    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    page_id = Column(ForeignKey("pages.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    user = relationship("User")
    page = relationship("Page")
