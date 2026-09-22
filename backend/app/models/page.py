from sqlalchemy import Column, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base, SoftDeleteMixin

class Page(SoftDeleteMixin, Base):
    __tablename__ = "pages"

    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    content_json = Column(JSON, nullable=True)

    user = relationship("User")
