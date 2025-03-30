from motor.motor_asyncio import AsyncIOMotorClient

from api.database.crud.base import BaseCRUD
from api.models.account import Account


class Accounts(BaseCRUD):
    def __init__(self, client: AsyncIOMotorClient, database: str):
        super().__init__(client)
        self.collection = self._client[database]["accounts"]

    async def update(self, account: Account):
        return await self.collection.update_one(
            {"user_id": account.user_id},
            {
                "$set": {
                    "username": account.username,
                    "password": account.password,
                    "email": account.email,
                    "bio": account.bio,
                }
            },
            upsert=True,
        )

    async def create(self, account: Account):
        return await self.update(account)

    async def find(self, user_id: str):
        return Account(**(await self.collection.find_one({"user_id": user_id})))

    async def delete(self, user_id: str):
        return await self.collection.delete_one({"user_id": user_id})
    
    async def find_by_email(self, email: str):
        return Account(**(await self.collection.find({"email": email})))
