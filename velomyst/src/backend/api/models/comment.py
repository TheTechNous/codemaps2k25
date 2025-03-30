from datetime import datetime, timezone
from functools import partial
from bson.objectid import ObjectId
from pydantic import Field
from api.models.base import BaseModel
from api.models.media import MediaMeta


class Comment(BaseModel):
    comment_id: ObjectId = Field(alias="_id")
    user_id: ObjectId
    article_id: ObjectId
    text: str
    media: MediaMeta | None = None
    created_on: datetime = Field(default_factory=partial(datetime.now, timezone.utc))

    def db_export(self):
        return {
            "user_id": self.user_id,
            "article_id": self.article_id,
            "text": self.text,
            "img": {
                "file_id": self.media.file_id,
                "ext": self.media.ext,
                "name": self.media.name,
            }
            if self.media
            else None,
            "created_on": self.created_on
        }
