from abc import ABC, abstractmethod

from motor.motor_asyncio import AsyncIOMotorClient


class BaseCRUD(ABC):
    def __init__(self, client: AsyncIOMotorClient):
        self._client = client

    @abstractmethod
    async def create(self, *args, **kwargs):
        ...

    @abstractmethod
    async def find(self, *args, **kwargs):
        ...

    @abstractmethod
    async def update(self, *args, **kwargs):
        ...

    @abstractmethod
    async def delete(self, *args, **kwargs):
        ...
