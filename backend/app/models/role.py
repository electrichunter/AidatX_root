from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from app.database import Base


class Permission(Base):
    __tablename__ = "permissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(200), nullable=True)

    # Relationships
    roles: Mapped[List["Role"]] = relationship(
        "Role", secondary="role_permissions", back_populates="permissions"
    )


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(200), nullable=True)

    # Relationships
    permissions: Mapped[List[Permission]] = relationship(
        "Permission", secondary="role_permissions", back_populates="roles"
    )
    users: Mapped[List["User"]] = relationship("User", back_populates="role")  # noqa: F821


class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id: Mapped[int] = mapped_column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)
    permission_id: Mapped[int] = mapped_column(Integer, ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True)
