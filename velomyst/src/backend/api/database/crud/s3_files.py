from motor.motor_asyncio import AsyncIOMotorClient

from api.database.crud.base import BaseCRUD
from api.models.media import MediaMeta


class S3Files(BaseCRUD):
    def __init__(self, client: AsyncIOMotorClient, database: str):
        super().__init__(client)
        self.collection = self._client[database]["mediaMeta"]

    async def update(self, media: MediaMeta):
        return await self.collection.update_one(
            {"file_id": media.file_id},
            {
                "$set": {"name": media.name, "ext": media.ext},
                "$currentDate": {"lastModified": True},
            },
            upsert=True
        )
    
    async def create(self, media: MediaMeta):
        return await self.update(media)
    
    async def find(self, file_id: str):
        resp = await self.collection.find_one({"file_id": file_id})
        if not resp:
            return None
        return MediaMeta(resp)
    
    async def delete(self , file_id: str):
        return await self.collection.delete_one({"file_id": file_id})
