from bson import ObjectId
from pydantic import EmailStr, Field

from api.models.base import BaseModel


class Account(BaseModel):
    user_id : ObjectId | None = Field(alias="_id")
    username : str
    password : str
    email : EmailStr
    bio : str = ""

    def db_export(self):
        raise NotImplementedError()
