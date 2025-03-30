from abc import ABC, abstractmethod


class BaseHashPolicy(ABC):
    @staticmethod
    @abstractmethod
    def hash(content: bytes): ...

    @staticmethod
    @abstractmethod
    def hash_password(content: bytes): ...
