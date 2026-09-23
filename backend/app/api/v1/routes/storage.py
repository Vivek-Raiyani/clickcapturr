from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.api import deps
from app.models.user import User
from app.schemas.response import DataResponse, MessageResponse
from app.utils.storage import storage

router = APIRouter()

@router.post("/upload", response_model=DataResponse[str])
async def upload_file(
    file: UploadFile = File(...),
    page_id: str = "",
    current_user: User = Depends(deps.get_current_user)
):
    """
    Upload a deliverable file for a page.
    Scoped to deliverables/{page_id}/ — clears the folder before uploading
    so only one file ever exists per page.
    """
    service = f"deliverables/{page_id}" if page_id else "deliverables/unsaved"
    
    # Clear any previously uploaded file in this page's folder
    storage.clear_folder(user_id=str(current_user.id), service=service)
    
    file_bytes = await file.read()
    file_url = storage.upload_file(
        user_id=str(current_user.id),
        service=service,
        filename=file.filename,
        file_bytes=file_bytes
    )
    
    return DataResponse(data=file_url)

@router.get("/url/{filename}", response_model=DataResponse[str])
async def get_url_test(
    filename: str,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Test endpoint to get the URL of a previously uploaded file.
    """
    file_url = storage.get_file_url(
        user_id=str(current_user.id),
        service="test",
        filename=filename
    )
    return DataResponse(data=file_url)

@router.delete("/delete/{filename}", response_model=MessageResponse)
async def delete_file(
    filename: str,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Delete an uploaded file.
    """
    success = storage.delete_file(
        user_id=str(current_user.id),
        service="deliverables",
        filename=filename
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="File not found or could not be deleted")
        
    return MessageResponse(message="File successfully deleted")
