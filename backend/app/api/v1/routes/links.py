from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.models.user import User
from app.schemas.response import DataResponse, MessageResponse
from app.schemas.link import LinkCreate, LinkUpdate, LinkResponse, RedirectResponse
from app.services.link_service import link_service

router = APIRouter()

@router.post("/", response_model=DataResponse[LinkResponse])
async def create_link(
    link_in: LinkCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    if not link_in.page_id and not link_in.campaign_id:
        raise HTTPException(status_code=400, detail="Must provide either page_id or campaign_id")
    
    if link_in.page_id:
        raise HTTPException(status_code=400, detail="Cannot manually create links for pages. Pages automatically generate their own links.")
        
    link = await link_service.create_link(db, current_user.id, link_in)
    return DataResponse(data=link)

@router.get("/", response_model=DataResponse[List[LinkResponse]])
async def get_my_links(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    links = await link_service.get_links_for_user(db, current_user.id)
    return DataResponse(data=links)

@router.get("/r/{code}", response_model=DataResponse[RedirectResponse])
async def redirect_link(
    code: str,
    db: AsyncSession = Depends(deps.get_db)
):
    result = await link_service.process_redirect(db, code)
    if not result:
        raise HTTPException(status_code=404, detail="Link not found")
    
    return DataResponse(data=RedirectResponse(**result))

@router.get("/{link_id}", response_model=DataResponse[LinkResponse])
async def get_link(
    link_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    link = await link_service.get_link_by_id(db, link_id, current_user.id)
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    return DataResponse(data=link)

@router.put("/{link_id}", response_model=DataResponse[LinkResponse])
async def update_link(
    link_id: UUID,
    link_in: LinkUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    link = await link_service.update_link(db, link_id, current_user.id, link_in)
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    return DataResponse(data=link)

@router.delete("/{link_id}", response_model=MessageResponse)
async def delete_link(
    link_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    link = await link_service.get_link_by_id(db, link_id, current_user.id)
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
        
    if link.page_id:
        raise HTTPException(status_code=400, detail="Cannot delete links associated with pages.")

    success = await link_service.delete_link(db, link_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Link not found")
    return MessageResponse(message="Link deleted successfully")

from app.services.youtube_service import youtube_service

@router.post("/{link_id}/sync-stats", response_model=DataResponse[LinkResponse])
async def sync_link_stats(
    link_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    link = await link_service.get_link_by_id(db, link_id, current_user.id)
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
        
    if link.platform == "youtube" and link.platform_content_id:
        stats = await youtube_service.fetch_video_stats(link.platform_content_id)
        if stats and "viewCount" in stats:
            link.platform_views = stats["viewCount"]
            await db.commit()
            await db.refresh(link)
    
    return DataResponse(data=link)

