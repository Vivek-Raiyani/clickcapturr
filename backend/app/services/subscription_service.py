import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models.subscription import Feature, SubscriptionPlan, PlanFeature, UserSubscription, PaymentHistory
from app.schemas.subscription import FeatureCreate, SubscriptionPlanCreate, PlanFeatureCreate

async def create_feature(db: AsyncSession, feature_in: FeatureCreate) -> Feature:
    db_obj = Feature(**feature_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_features(db: AsyncSession) -> list[Feature]:
    result = await db.execute(select(Feature))
    return result.scalars().all()

async def create_plan(db: AsyncSession, plan_in: SubscriptionPlanCreate) -> SubscriptionPlan:
    db_obj = SubscriptionPlan(**plan_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_plans(db: AsyncSession) -> list[SubscriptionPlan]:
    result = await db.execute(select(SubscriptionPlan).options(selectinload(SubscriptionPlan.features).selectinload(PlanFeature.feature)))
    return result.scalars().all()

async def add_feature_to_plan(db: AsyncSession, plan_id: uuid.UUID, feature_in: PlanFeatureCreate) -> PlanFeature:
    db_obj = PlanFeature(
        plan_id=plan_id,
        feature_id=feature_in.feature_id,
        limit_value=feature_in.limit_value
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    # Eagerly load the feature for the response
    result = await db.execute(
        select(PlanFeature).options(selectinload(PlanFeature.feature)).filter(PlanFeature.id == db_obj.id)
    )
    return result.scalars().first()

async def remove_feature_from_plan(db: AsyncSession, plan_id: uuid.UUID, feature_id: uuid.UUID):
    result = await db.execute(
        select(PlanFeature).filter(PlanFeature.plan_id == plan_id, PlanFeature.feature_id == feature_id)
    )
    db_obj = result.scalars().first()
    if db_obj:
        await db.delete(db_obj)
        await db.commit()
    return db_obj

async def get_active_subscription(db: AsyncSession, user_id: uuid.UUID) -> UserSubscription | None:
    result = await db.execute(
        select(UserSubscription)
        .options(selectinload(UserSubscription.plan).selectinload(SubscriptionPlan.features).selectinload(PlanFeature.feature))
        .filter(UserSubscription.user_id == user_id, UserSubscription.status == "active")
    )
    return result.scalars().first()

async def get_payment_history(db: AsyncSession, user_id: uuid.UUID) -> list[PaymentHistory]:
    result = await db.execute(
        select(PaymentHistory).filter(PaymentHistory.user_id == user_id).order_by(PaymentHistory.id.desc())
    )
    return result.scalars().all()

async def mock_cashfree_payment(db: AsyncSession, user_id: uuid.UUID, plan_id: uuid.UUID) -> UserSubscription:
    # 1. Fetch the plan to know the price
    plan_result = await db.execute(select(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id))
    plan = plan_result.scalars().first()
    if not plan:
        raise ValueError("Plan not found")
        
    # 2. Cancel existing active subscriptions
    active_subs_result = await db.execute(
        select(UserSubscription).filter(UserSubscription.user_id == user_id, UserSubscription.status == "active")
    )
    for sub in active_subs_result.scalars().all():
        sub.status = "canceled"
        sub.current_period_end = datetime.now(timezone.utc)
        
    # 3. Create mock payment record
    mock_order_id = f"ORDER_{uuid.uuid4().hex[:8].upper()}"
    mock_payment_id = f"PAY_{uuid.uuid4().hex[:12].upper()}"
    mock_invoice_url = f"https://mock-invoice-url.com/{mock_order_id}.pdf"
    
    payment = PaymentHistory(
        user_id=user_id,
        amount=plan.price,
        currency="INR",
        status="SUCCESS",
        cashfree_order_id=mock_order_id,
        cashfree_payment_id=mock_payment_id,
        invoice_url=mock_invoice_url
    )
    db.add(payment)
    
    # 4. Create new user subscription (let's assume it's valid for 30 days)
    new_sub = UserSubscription(
        user_id=user_id,
        plan_id=plan_id,
        status="active",
        current_period_start=datetime.now(timezone.utc),
        current_period_end=datetime.now(timezone.utc) + timedelta(days=30)
    )
    db.add(new_sub)
    
    await db.commit()
    await db.refresh(new_sub)
    
    # Eager load plan for response
    result = await db.execute(
        select(UserSubscription)
        .options(selectinload(UserSubscription.plan).selectinload(SubscriptionPlan.features).selectinload(PlanFeature.feature))
        .filter(UserSubscription.id == new_sub.id)
    )
    return result.scalars().first()
