import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import engine
from app.models import Base

# Ensure media directory exists if not on Vercel
if not os.environ.get("VERCEL"):
    os.makedirs("media", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.environ.get("VERCEL"):
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan
)

# Required by Authlib for Starlette
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.environ.get("VERCEL"):
    app.mount("/media", StaticFiles(directory="media"), name="media")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI Template. Visit /docs for the API documentation."}
