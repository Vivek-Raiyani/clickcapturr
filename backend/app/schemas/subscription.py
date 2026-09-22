from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class FeatureBase(BaseModel):
    name: str
    description: Optional[str] = None

class FeatureCreate(FeatureBase):
    pass

class FeatureOut(FeatureBase):
    id: UUID

    class Config:
        from_attributes = True

class PlanFeatureBase(BaseModel):
    feature_id: UUID
    limit_value: Optional[int] = None

class PlanFeatureCreate(PlanFeatureBase):
    pass

class PlanFeatureOut(PlanFeatureBase):
    id: UUID
    feature: FeatureOut

    class Config:
        from_attributes = True

class SubscriptionPlanBase(BaseModel):
    name: str
    price: float

class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass

class SubscriptionPlanOut(SubscriptionPlanBase):
    id: UUID
    features: List[PlanFeatureOut] = []

    class Config:
        from_attributes = True

class UserSubscriptionBase(BaseModel):
    plan_id: UUID
    status: str
    current_period_start: datetime
    current_period_end: Optional[datetime] = None

class UserSubscriptionOut(UserSubscriptionBase):
    id: UUID
    user_id: UUID
    plan: SubscriptionPlanOut

    class Config:
        from_attributes = True

class PaymentHistoryBase(BaseModel):
    amount: float
    currency: str
    status: str
    cashfree_order_id: Optional[str] = None
    cashfree_payment_id: Optional[str] = None
    invoice_url: Optional[str] = None

class PaymentHistoryOut(PaymentHistoryBase):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True
