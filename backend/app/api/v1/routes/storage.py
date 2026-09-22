from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.api import deps
from app.models.user import User
from app.schemas.response import DataResponse, MessageResponse
from app.utils.storage import storage

router = APIRouter()

@router.post("/upload-test", response_model=DataResponse[str])
async def upload_test(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Test endpoint for authenticated users to upload a file to the active storage provider.
    """
    file_bytes = await file.read()
    
    # Store it under the 'test' service directory
    file_url = storage.upload_file(
        user_id=str(current_user.id),
        service="test",
        filename=file.filename,
        file_bytes=file_bytes
    )
    
    return DataResponse(data=file_url)

@router.get("/url-test/{filename}", response_model=DataResponse[str])
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

@router.delete("/delete-test/{filename}", response_model=MessageResponse)
async def delete_test(
    filename: str,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Test endpoint to delete an uploaded file.
    """
    success = storage.delete_file(
        user_id=str(current_user.id),
        service="test",
        filename=filename
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="File not found or could not be deleted")
        
    return MessageResponse(message="File successfully deleted")
