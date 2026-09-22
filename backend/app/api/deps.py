from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import ValidationError
import uuid

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.user import User
from app.models.subscription import UserSubscription, PlanFeature, Feature
from app.schemas.token import TokenPayload

reusable_oauth2 = HTTPBearer()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as db:
        yield db

async def get_current_user(
    db: AsyncSession = Depends(get_db), token_credentials: HTTPAuthorizationCredentials = Depends(reusable_oauth2)
) -> User:
    token = token_credentials.credentials
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    try:
        user_uuid = uuid.UUID(token_data.sub)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid token subject format")

    result = await db.execute(select(User).filter(User.id == user_uuid))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user

class RequireFeature:
    def __init__(self, feature_name: str):
        self.feature_name = feature_name

    async def __call__(self, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
        # Superusers bypass feature restrictions
        if current_user.is_superuser:
            return current_user

        # Fetch active user subscription
        result = await db.execute(
            select(UserSubscription)
            .filter(
                UserSubscription.user_id == current_user.id,
                UserSubscription.status == "active"
            )
        )
        active_subscription = result.scalars().first()
        
        if not active_subscription:
            raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Active subscription required")

        # Fetch PlanFeature mapping to see if this plan has this feature
        result = await db.execute(
            select(PlanFeature)
            .join(Feature)
            .filter(
                PlanFeature.plan_id == active_subscription.plan_id,
                Feature.name == self.feature_name
            )
        )
        plan_feature = result.scalars().first()

        if not plan_feature:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Your current subscription plan does not include access to: {self.feature_name}. Please upgrade."
            )

        # We return the tuple (user, plan_feature) so the endpoint can check the limit_value if it wants to track usage!
        return current_user, plan_feature
