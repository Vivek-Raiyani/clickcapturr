from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from authlib.integrations.starlette_client import OAuth

from app.api import deps
from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserOut, UserLogin, UserCreateOAuth
from app.schemas.response import DataResponse, MessageResponse
from app.services import auth_service
from app.models.user import User

router = APIRouter(prefix="/auth")

oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID or "placeholder",
    client_secret=settings.GOOGLE_CLIENT_SECRET or "placeholder",
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

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

@router.post("/signin", response_model=DataResponse[Token])
async def signin(
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

@router.post("/signout", response_model=MessageResponse)
async def signout(current_user: User = Depends(deps.get_current_user)):
    """
    Logout the user.
    Note: Since JWTs are stateless, this endpoint just returns a success message.
    The actual token clearing must be done by the client frontend.
    """
    return MessageResponse(message="Successfully logged out. Please clear your token on the client.")

@router.get("/google")
async def auth_google(request: Request):
    """
    Redirects the user to the Google OAuth consent screen.
    """
    # Assuming the frontend is running on standard ports. Update this logic if frontend passes redirect_uri.
    redirect_uri = str(request.url_for('auth_google_callback'))
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback", response_model=DataResponse[Token])
async def auth_google_callback(request: Request, db: AsyncSession = Depends(deps.get_db)):
    """
    Handles the callback from Google, creates user if necessary (with unaccepted policies),
    and returns a JWT token for the frontend.
    """
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not authorize with Google")
    
    user_info = token.get('userinfo')
    if not user_info:
        raise HTTPException(status_code=400, detail="No user info returned from Google")
    
    user_in = UserCreateOAuth(
        email=user_info.get("email"),
        first_name=user_info.get("given_name", ""),
        last_name=user_info.get("family_name"),
        google_id=user_info.get("sub"),
        auth_provider="google",
        age_consent=False,
        terms_policy_accepted=False
    )
    
    user = await auth_service.create_or_get_oauth_user(db, user_in=user_in)
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        {"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    token_response = Token(
        access_token=access_token,
        token_type="bearer"
    )
    return DataResponse(data=token_response)
