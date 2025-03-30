from api.models.base import BaseModel

class ReferenceLink(BaseModel):
    text : str
    link : str

    def db_export(self):
        return {"link" : self.link, "text" : self.text}