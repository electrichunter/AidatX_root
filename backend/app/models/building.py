from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Building(Base):
    __tablename__ = "buildings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    address: Mapped[str] = mapped_column(String(500))
    city: Mapped[str] = mapped_column(String(100))
    manager_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    blocks: Mapped[list["Block"]] = relationship("Block", back_populates="building", cascade="all, delete-orphan")
    expenses: Mapped[list["Expense"]] = relationship("Expense", back_populates="building", cascade="all, delete-orphan")  # noqa: F821
    announcements: Mapped[list["Announcement"]] = relationship("Announcement", back_populates="building", cascade="all, delete-orphan")  # noqa: F821


class Block(Base):
    __tablename__ = "blocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))  # e.g. "A Blok"
    building_id: Mapped[int] = mapped_column(Integer, ForeignKey("buildings.id", ondelete="CASCADE"))

    building: Mapped["Building"] = relationship("Building", back_populates="blocks")
    apartments: Mapped[list["Apartment"]] = relationship("Apartment", back_populates="block", cascade="all, delete-orphan")


class Apartment(Base):
    __tablename__ = "apartments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    number: Mapped[str] = mapped_column(String(20))  # Daire no, e.g. "12"
    floor: Mapped[int | None] = mapped_column(Integer, nullable=True)
    area_sqm: Mapped[float | None] = mapped_column(Float, nullable=True)  # m²
    is_occupied: Mapped[bool] = mapped_column(Boolean, default=False)

    block_id: Mapped[int] = mapped_column(Integer, ForeignKey("blocks.id", ondelete="CASCADE"))
    resident_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    block: Mapped["Block"] = relationship("Block", back_populates="apartments")
    resident: Mapped["User | None"] = relationship(  # noqa: F821
        "User", back_populates="apartments", foreign_keys=[resident_id]
    )
    dues: Mapped[list["Due"]] = relationship("Due", back_populates="apartment", cascade="all, delete-orphan")  # noqa: F821
