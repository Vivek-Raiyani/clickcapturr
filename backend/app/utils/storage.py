import os
from abc import ABC, abstractmethod
from typing import BinaryIO
from app.core.config import settings

class StorageProvider(ABC):
    """Abstract base class for all storage providers."""
    
    @abstractmethod
    def upload_file(self, user_id: int, service: str, filename: str, file_bytes: bytes) -> str:
        """Uploads a file and returns the accessible URL."""
        pass

    @abstractmethod
    def delete_file(self, user_id: int, service: str, filename: str) -> bool:
        """Deletes a file by its name."""
        pass

    @abstractmethod
    def get_file_url(self, user_id: int, service: str, filename: str) -> str:
        """Returns the public URL to access the file."""
        pass


class LocalStorageProvider(StorageProvider):
    """Implementation for local file system storage."""
    
    def __init__(self, base_dir: str = "media"):
        self.base_dir = base_dir
        # Ensure the directory exists
        os.makedirs(self.base_dir, exist_ok=True)

    def upload_file(self, user_id: int, service: str, filename: str, file_bytes: bytes) -> str:
        rel_path = f"users/{user_id}/{service}/{filename}"
        file_path = os.path.join(self.base_dir, rel_path)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(file_bytes)
        return self.get_file_url(user_id, service, filename)

    def delete_file(self, user_id: int, service: str, filename: str) -> bool:
        rel_path = f"users/{user_id}/{service}/{filename}"
        file_path = os.path.join(self.base_dir, rel_path)
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False

    def get_file_url(self, user_id: int, service: str, filename: str) -> str:
        # Returns an absolute URL based on the server host
        return f"{settings.SERVER_HOST.rstrip('/')}/{self.base_dir}/users/{user_id}/{service}/{filename}"


class CloudStorageProvider(StorageProvider):
    """Implementation for Cloud storage (e.g. AWS S3)."""
    
    def __init__(self):
        import boto3
        if not all([settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY, settings.AWS_REGION_NAME, settings.AWS_BUCKET_NAME]):
            raise ValueError("Missing AWS S3 configuration in settings")
            
        self.bucket_name = settings.AWS_BUCKET_NAME
        self.region = settings.AWS_REGION_NAME
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=self.region,
        )
    
    def upload_file(self, user_id: int, service: str, filename: str, file_bytes: bytes) -> str:
        key = f"users/{user_id}/{service}/{filename}"
        self.s3_client.put_object(
            Bucket=self.bucket_name,
            Key=key,
            Body=file_bytes
        )
        return self.get_file_url(user_id, service, filename)

    def delete_file(self, user_id: int, service: str, filename: str) -> bool:
        key = f"users/{user_id}/{service}/{filename}"
        self.s3_client.delete_object(
            Bucket=self.bucket_name,
            Key=key
        )
        return True

    def get_file_url(self, user_id: int, service: str, filename: str) -> str:
        key = f"users/{user_id}/{service}/{filename}"
        return f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{key}"


def get_storage_provider() -> StorageProvider:
    """Factory to get the configured storage provider."""
    provider = getattr(settings, "STORAGE_PROVIDER", "local").lower()
    
    if provider == "local":
        return LocalStorageProvider()
    elif provider == "cloud" or provider == "s3":
        return CloudStorageProvider()
    else:
        raise ValueError(f"Unsupported storage provider configured: {provider}")

# A global instance you can import and use across the app:
# from app.utils.storage import storage
# url = storage.upload_file("avatar.png", image_bytes)
storage = get_storage_provider()
