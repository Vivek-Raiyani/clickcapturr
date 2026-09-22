from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.models.user import User
from app.schemas.response import DataResponse, MessageResponse
from app.schemas.subscription import (
    FeatureCreate, FeatureOut,
    SubscriptionPlanCreate, SubscriptionPlanOut,
    PlanFeatureCreate, PlanFeatureOut,
    UserSubscriptionOut, PaymentHistoryOut
)
from app.services import subscription_service

router = APIRouter()

# ----------------------------------------
# Admin Endpoints (Require Superuser)
# ----------------------------------------

@router.post("/features", response_model=DataResponse[FeatureOut])
async def create_feature(
    feature_in: FeatureCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_superuser)
):
    feature = await subscription_service.create_feature(db, feature_in)
    return DataResponse(data=feature)

@router.get("/features", response_model=DataResponse[List[FeatureOut]])
async def get_features(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_superuser)
):
    features = await subscription_service.get_features(db)
    return DataResponse(data=features)

@router.post("/plans", response_model=DataResponse[SubscriptionPlanOut])
async def create_plan(
    plan_in: SubscriptionPlanCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_superuser)
):
    plan = await subscription_service.create_plan(db, plan_in)
    return DataResponse(data=plan)

@router.get("/plans", response_model=DataResponse[List[SubscriptionPlanOut]])
async def get_plans(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    # Active users can fetch available plans to view pricing page
    plans = await subscription_service.get_plans(db)
    return DataResponse(data=plans)

@router.post("/plans/{plan_id}/features", response_model=DataResponse[PlanFeatureOut])
async def add_feature_to_plan(
    plan_id: UUID,
    feature_in: PlanFeatureCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_superuser)
):
    plan_feature = await subscription_service.add_feature_to_plan(db, plan_id, feature_in)
    return DataResponse(data=plan_feature)

@router.delete("/plans/{plan_id}/features/{feature_id}", response_model=MessageResponse)
async def remove_feature_from_plan(
    plan_id: UUID,
    feature_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_superuser)
):
    await subscription_service.remove_feature_from_plan(db, plan_id, feature_id)
    return MessageResponse(message="Feature removed from plan successfully")

# ----------------------------------------
# User Endpoints
# ----------------------------------------

@router.get("/me", response_model=DataResponse[UserSubscriptionOut])
async def get_my_subscription(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    sub = await subscription_service.get_active_subscription(db, current_user.id)
    if not sub:
        raise HTTPException(status_code=404, detail="No active subscription found")
    return DataResponse(data=sub)

@router.get("/payments", response_model=DataResponse[List[PaymentHistoryOut]])
async def get_my_payments(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    payments = await subscription_service.get_payment_history(db, current_user.id)
    return DataResponse(data=payments)

@router.post("/mock-payment", response_model=DataResponse[UserSubscriptionOut])
async def mock_payment(
    plan_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Temporary endpoint to simulate a successful Cashfree payment.
    It provisions an invoice_url, marks any existing subscription as canceled,
    and provisions the user with the newly paid plan.
    """
    try:
        sub = await subscription_service.mock_cashfree_payment(db, current_user.id, plan_id)
        return DataResponse(data=sub)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
