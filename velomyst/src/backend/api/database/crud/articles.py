from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

from api.database.crud.base import BaseCRUD
from api.models.article import Article


class Articles(BaseCRUD):
    def __init__(self, client: AsyncIOMotorClient, database: str):
        super().__init__(client)
        self.collection = self._client[database]["articles"]

    async def create(self, article: Article):
        return await self.collection.insert_one(
            {"_id": article._id, **article.db_export()}
        )

    async def update(self, article: Article):
        return await self.collection.update_one({**article.db_export()})

    async def find(self, article_id: str):
        return Article(**(await self.collection.find_one({"_id": ObjectId(article_id)})))

    async def delete(self, article_id: str):
        return await self.collection.delete_one({"_id": ObjectId(article_id)})
