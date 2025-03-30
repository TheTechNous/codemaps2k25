from api.core.security.hashing.policies.base import BaseHashPolicy
from api.core.security.hashing.policies.basic import BasicHashing


class SecurityScaffold:
    def __init__(self, hashing_policy: BaseHashPolicy = BasicHashing):
        # TODO: Log warning if BasicHashing or None
        self.hashing_policy = hashing_policy

    def hash_password(self, content: str):
        return self.hashing_policy.hash_password(content)
    
    def hash(self, content: str):
        return self.hashing_policy.hash(content)
