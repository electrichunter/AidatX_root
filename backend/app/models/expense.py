import enum
from datetime import datetime, date, timezone
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Date, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ExpenseCategory(str, enum.Enum):
    electricity = "electricity"   # Elektrik
    water = "water"               # Su
    cleaning = "cleaning"         # Temizlik
    security = "security"         # Güvenlik
    maintenance = "maintenance"   # Bakım/Onarım
    elevator = "elevator"         # Asansör
    insurance = "insurance"       # Sigorta
    other = "other"               # Diğer


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    building_id: Mapped[int] = mapped_column(Integer, ForeignKey("buildings.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(200))
    category: Mapped[ExpenseCategory] = mapped_column(Enum(ExpenseCategory), default=ExpenseCategory.other)
    amount: Mapped[float] = mapped_column(Float)
    expense_date: Mapped[date] = mapped_column(Date)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    building: Mapped["Building"] = relationship("Building", back_populates="expenses")  # noqa: F821
