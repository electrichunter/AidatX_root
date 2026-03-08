from pydantic import BaseModel
from datetime import datetime


class BuildingCreate(BaseModel):
    name: str
    address: str
    city: str
    manager_id: int | None = None


class BuildingUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    city: str | None = None
    manager_id: int | None = None


class BuildingOut(BaseModel):
    id: int
    name: str
    address: str
    city: str
    manager_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class BlockCreate(BaseModel):
    name: str
    building_id: int


class BlockOut(BaseModel):
    id: int
    name: str
    building_id: int

    model_config = {"from_attributes": True}


class ApartmentCreate(BaseModel):
    number: str
    floor: int | None = None
    area_sqm: float | None = None
    block_id: int
    resident_id: int | None = None


class ApartmentUpdate(BaseModel):
    number: str | None = None
    floor: int | None = None
    area_sqm: float | None = None
    resident_id: int | None = None
    is_occupied: bool | None = None


class ApartmentOut(BaseModel):
    id: int
    number: str
    floor: int | None
    area_sqm: float | None
    is_occupied: bool
    block_id: int
    resident_id: int | None

    model_config = {"from_attributes": True}
