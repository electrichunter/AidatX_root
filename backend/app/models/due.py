import enum
from datetime import datetime, date, timezone
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Date, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class DueStatus(str, enum.Enum):
    pending = "pending"       # Bekliyor
    paid = "paid"             # Ödendi
    overdue = "overdue"       # Gecikti
    partial = "partial"       # Kısmi ödeme


class Due(Base):
    """Aidat dönemi — bir dairenin belirli bir döneme ait aidat borcu."""
    __tablename__ = "dues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    apartment_id: Mapped[int] = mapped_column(Integer, ForeignKey("apartments.id", ondelete="CASCADE"))
    period_year: Mapped[int] = mapped_column(Integer)    # e.g. 2026
    period_month: Mapped[int] = mapped_column(Integer)   # 1-12
    amount: Mapped[float] = mapped_column(Float)
    due_date: Mapped[date] = mapped_column(Date)         # Son ödeme tarihi
    status: Mapped[DueStatus] = mapped_column(Enum(DueStatus), default=DueStatus.pending)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="dues")  # noqa: F821
    payments: Mapped[list["Payment"]] = relationship("Payment", back_populates="due", cascade="all, delete-orphan")  # noqa: F821
