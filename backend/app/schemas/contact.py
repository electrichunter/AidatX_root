from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class ContactMessageBase(BaseModel):
    full_name: str = Field(..., max_length=120)
    email: EmailStr
    subject: str = Field(..., max_length=200)
    message: str = Field(..., min_length=10)


class ContactMessageCreate(ContactMessageBase):
    pass


class ContactMessageResponse(ContactMessageBase):
    id: int
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
