from datetime import datetime
from pydantic import BaseModel


class AnnouncementCreate(BaseModel):
    building_id: int
    title: str
    content: str
    is_pinned: bool = False


class AnnouncementUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    is_pinned: bool | None = None


class AnnouncementOut(BaseModel):
    id: int
    building_id: int
    title: str
    content: str
    is_pinned: bool
    created_by_id: int | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
