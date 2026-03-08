from datetime import datetime, date
from pydantic import BaseModel
from app.models.payment import PaymentMethod, PaymentStatus


class PaymentCreate(BaseModel):
    due_id: int
    amount: float
    payment_date: date
    method: PaymentMethod = PaymentMethod.cash
    note: str | None = None
    receipt_number: str | None = None


class PaymentUpdate(BaseModel):
    status: PaymentStatus | None = None
    note: str | None = None


class PaymentOut(BaseModel):
    id: int
    due_id: int
    payer_id: int | None
    amount: float
    payment_date: date
    method: PaymentMethod
    status: PaymentStatus
    note: str | None
    receipt_number: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
