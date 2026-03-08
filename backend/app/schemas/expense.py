from datetime import datetime, date
from pydantic import BaseModel
from app.models.expense import ExpenseCategory


class ExpenseCreate(BaseModel):
    building_id: int
    title: str
    category: ExpenseCategory = ExpenseCategory.other
    amount: float
    expense_date: date
    description: str | None = None


class ExpenseUpdate(BaseModel):
    title: str | None = None
    category: ExpenseCategory | None = None
    amount: float | None = None
    expense_date: date | None = None
    description: str | None = None


class ExpenseOut(BaseModel):
    id: int
    building_id: int
    title: str
    category: ExpenseCategory
    amount: float
    expense_date: date
    description: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
