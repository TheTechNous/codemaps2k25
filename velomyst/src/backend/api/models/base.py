from abc import ABC, abstractmethod
from typing import Any
from pydantic import BaseModel as PDBase


class BaseModel(ABC, PDBase):
    model_config = {"arbitrary_types_allowed": True}

    @abstractmethod
    def db_export(self, *args, **kwargs) -> dict[str, Any]: ...
