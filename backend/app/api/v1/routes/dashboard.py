from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.models.user import User
from app.schemas.response import DataResponse
from app.schemas.dashboard import DashboardStatsResponse
from app.services.dashboard_service import dashboard_service

router = APIRouter()

@router.get("/stats", response_model=DataResponse[DashboardStatsResponse])
async def get_dashboard_stats(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    stats = await dashboard_service.get_dashboard_stats(db, current_user.id)
    return DataResponse(data=stats)
