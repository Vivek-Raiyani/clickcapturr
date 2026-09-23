from fastapi import APIRouter
from app.api.v1.routes import auth, storage, subscriptions, pages, campaigns, links, contacts, dashboard, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(storage.router, prefix="/storage", tags=["storage"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(pages.router, prefix="/pages", tags=["pages"])
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
api_router.include_router(links.router, prefix="/links", tags=["links"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
