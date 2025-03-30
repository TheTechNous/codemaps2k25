import os
from motor.motor_asyncio import AsyncIOMotorClient

from api.database.crud.accounts import Accounts
from api.database.crud.articles import Articles
from api.database.crud.categories import Categories
from api.database.crud.comments import Comments
from api.database.crud.s3_files import S3Files

mongo = AsyncIOMotorClient(os.getenv("MONGO_URI"))


class Database:
    def __init__(self, name: str):
        self.name = name
        self.s3 = S3Files(mongo, self.name)
        self.account = Accounts(mongo, self.name)
        self.article = Articles(mongo, self.name)
        self.categories = Categories(mongo, self.name)
        self.comments = Comments(mongo, self.name)
