from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.models.user import User
from app.schemas.response import DataResponse, MessageResponse
from app.schemas.page import PageCreate, PageUpdate, PageResponse
from app.services.page_service import page_service

router = APIRouter()

@router.post("/", response_model=DataResponse[PageResponse])
async def create_page(
    page_in: PageCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    # Check if slug exists
    existing = await page_service.get_page_by_slug(db, page_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
        
    page = await page_service.create_page(db, current_user.id, page_in)
    return DataResponse(data=page)

@router.get("/", response_model=DataResponse[List[PageResponse]])
async def get_my_pages(
    q: Optional[str] = Query(None, description="Search by page name or slug"),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    pages = await page_service.get_pages_for_user(db, current_user.id, search=q)
    return DataResponse(data=pages)

@router.get("/{page_id}", response_model=DataResponse[PageResponse])
async def get_page(
    page_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    page = await page_service.get_page_by_id(db, page_id, current_user.id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return DataResponse(data=page)

@router.get("/public/{slug}", response_model=DataResponse[PageResponse])
async def get_public_page(
    slug: str,
    db: AsyncSession = Depends(deps.get_db)
):
    page = await page_service.get_page_by_slug(db, slug)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
        
    # Increment total visits on view
    page.total_visits += 1
    await db.commit()
    await db.refresh(page)
    
    return DataResponse(data=page)

@router.put("/{page_id}", response_model=DataResponse[PageResponse])
async def update_page(
    page_id: UUID,
    page_in: PageUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    if page_in.slug:
        existing = await page_service.get_page_by_slug(db, page_in.slug)
        if existing and existing.id != page_id:
            raise HTTPException(status_code=400, detail="Slug already exists")
            
    page = await page_service.update_page(db, page_id, current_user.id, page_in)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return DataResponse(data=page)

@router.delete("/{page_id}", response_model=MessageResponse)
async def delete_page(
    page_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    success = await page_service.delete_page(db, page_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Page not found")
    return MessageResponse(message="Page deleted successfully")
