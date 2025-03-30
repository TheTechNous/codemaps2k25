from datetime import datetime

from pydantic import Field
from api.models.base import BaseModel


class MediaMeta(BaseModel):
    file_id: str
    ext: str
    name: str
    last_updated: datetime = Field(alias="lastModified")

    def db_export(self):
        raise NotImplementedError()