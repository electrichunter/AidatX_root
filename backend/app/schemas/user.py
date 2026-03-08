from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.schemas.role import RoleOut


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    password: str
    role_id: int | None = None  # Default role applied in router if None


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    role_id: int | None = None
    is_active: bool | None = None


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str | None
    role: RoleOut
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
