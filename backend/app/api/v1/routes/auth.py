from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserOut, UserLogin
from app.schemas.response import DataResponse, MessageResponse
from app.services import auth_service
from app.models.user import User

router = APIRouter()

@router.post("/signup", response_model=DataResponse[UserOut])
async def signup(
    user_in: UserCreate,
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Create new user without the need to be logged in.
    """
    user = await auth_service.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = await auth_service.create_user(db, user_in=user_in)
    return DataResponse(data=user)

@router.post("/login", response_model=DataResponse[Token])
async def login_access_token(
    login_data: UserLogin, db: AsyncSession = Depends(deps.get_db)
):
    """
    Standard JSON token login, get an access token for future requests
    """
    user = await auth_service.get_user_by_email(db, email=login_data.email)
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    token = Token(
        access_token=create_access_token(
            {"sub": str(user.id)}, expires_delta=access_token_expires
        ),
        token_type="bearer"
    )
    return DataResponse(data=token)

@router.post("/test-token", response_model=DataResponse[UserOut])
async def test_token(current_user: User = Depends(deps.get_current_user)):
    """
    Test access token
    """
    return DataResponse(data=current_user)

@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: User = Depends(deps.get_current_user)):
    """
    Logout the user.
    Note: Since JWTs are stateless, this endpoint just returns a success message.
    The actual token clearing must be done by the client frontend.
    """
    return MessageResponse(message="Successfully logged out. Please clear your token on the client.")
