from datetime import datetime, date
from pydantic import BaseModel
from app.models.due import DueStatus


class DueCreate(BaseModel):
    apartment_id: int
    period_year: int
    period_month: int
    amount: float
    due_date: date
    description: str | None = None


class DueBulkCreate(BaseModel):
    """Tüm dairelere toplu aidat tanımla."""
    building_id: int
    period_year: int
    period_month: int
    amount: float
    due_date: date
    description: str | None = None


class DueUpdate(BaseModel):
    amount: float | None = None
    due_date: date | None = None
    status: DueStatus | None = None
    description: str | None = None


class DueOut(BaseModel):
    id: int
    apartment_id: int
    period_year: int
    period_month: int
    amount: float
    due_date: date
    status: DueStatus
    description: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
