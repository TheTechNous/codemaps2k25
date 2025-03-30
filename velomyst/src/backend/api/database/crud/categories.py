from motor.motor_asyncio import AsyncIOMotorClient
from api.database.crud.base import BaseCRUD
from api.models.category import Category


class Categories(BaseCRUD):
    def __init__(self, client: AsyncIOMotorClient, database: str):
        super().__init__(client)
        self.collection = self._client[database]["categories"]
    
    async def find(self, cid: int):
        return Category(**(await self.collection.find_one({"id": cid})))
    
    async def create(self, *args, **kwargs):
        ...
    
    async def delete(self, *args, **kwargs):
        ...
    
    async def update(self, *args, **kwargs):
        ...
