from datetime import datetime, timezone
from functools import partial
from bson.objectid import ObjectId
from pydantic import Field

from api.models.base import BaseModel
from api.models.media import MediaMeta
from api.models.reference_link import ReferenceLink
from api.models.category import Category


class Article(BaseModel):
    article_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    text: str
    custom_link: str
    author_id: ObjectId
    banner_img: MediaMeta
    embedded_img: list[MediaMeta] = []
    categories: list[Category]
    reference_links: list[ReferenceLink] = []
    created_on: datetime = Field(default_factory=partial(datetime.now, timezone.utc))

    def db_export(self):
        return {
            "text": self.text,
            "upload_date": self.upload_date,
            "author_id": self.author,
            "banner_img": {
                "file_id": self.banner_img.file_id,
                "ext": self.banner_img.ext,
                "name": self.banner_img.name,
            },
            "embedded_img": [
                {"file_id": y.file_id, "ext": y.ext, "name": y.name}
                for y in self.embedded_img
            ],
            "categories": self.categories,
            "reference_link": [x.db_export() for x in self.reference_links],
            "created_on": self.created_on
        }
