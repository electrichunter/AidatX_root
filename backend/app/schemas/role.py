from pydantic import BaseModel
from typing import List


class PermissionBase(BaseModel):
    name: str
    description: str | None = None


class PermissionOut(PermissionBase):
    id: int

    model_config = {"from_attributes": True}


class RoleBase(BaseModel):
    name: str
    description: str | None = None


class RoleOut(RoleBase):
    id: int
    permissions: List[PermissionOut] = []

    model_config = {"from_attributes": True}
