from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

from api.database.crud.base import BaseCRUD
from api.models.comment import Comment


class Comments(BaseCRUD):
    def __init__(self, client: AsyncIOMotorClient, database: str):
        super().__init__(client)
        self.collection = self._client[database]["comments"]

    async def create(self, comment: Comment):
        return await self.collection.insert_one(comment.db_export())

    async def find(self, comment_id: str):
        return Comment(
            **(await self.collection.find_one({"_id": ObjectId(comment_id)}))
        )

    async def update(self, *args, **kwargs): ...

    async def delete(self, comment_id: str):
        return await self.collection.delete_one({"_id": ObjectId(comment_id)})
