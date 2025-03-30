from hashlib import sha3_512
from api.core.security.hashing.policies.base import BaseHashPolicy


class BasicHashing(BaseHashPolicy):
    """Not recommended. Create your own hashing policy and save it locally."""

    @staticmethod
    def hash(content: bytes):
        return sha3_512(content).hexdigest()
    
    @staticmethod
    def hash_password(content: bytes):
        return sha3_512(content).hexdigest()