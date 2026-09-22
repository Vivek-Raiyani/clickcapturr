from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.models.base import Base, SoftDeleteMixin

class Feature(Base):
    __tablename__ = "features"

    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)

class SubscriptionPlan(SoftDeleteMixin, Base):
    __tablename__ = "subscription_plans"

    name = Column(String, unique=True, index=True, nullable=False)
    price = Column(Float, nullable=False, default=0.0)
    
    features = relationship("PlanFeature", back_populates="plan", cascade="all, delete-orphan")

class PlanFeature(Base):
    __tablename__ = "plan_features"

    plan_id = Column(ForeignKey("subscription_plans.id", ondelete="CASCADE"), nullable=False)
    feature_id = Column(ForeignKey("features.id", ondelete="CASCADE"), nullable=False)
    limit_value = Column(Integer, nullable=True) # If Null, it means unlimited

    plan = relationship("SubscriptionPlan", back_populates="features")
    feature = relationship("Feature")

class UserSubscription(SoftDeleteMixin, Base):
    __tablename__ = "user_subscriptions"

    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(ForeignKey("subscription_plans.id"), nullable=False)
    status = Column(String, nullable=False, default="active") # active, canceled, past_due
    current_period_start = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User")
    plan = relationship("SubscriptionPlan")

class PaymentHistory(Base):
    __tablename__ = "payment_history"

    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR", nullable=False)
    status = Column(String, nullable=False, default="PENDING") # SUCCESS, FAILED, PENDING
    cashfree_order_id = Column(String, nullable=True, index=True)
    cashfree_payment_id = Column(String, nullable=True, index=True)
    invoice_url = Column(String, nullable=True)
    
    user = relationship("User")
