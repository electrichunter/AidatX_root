import enum
from datetime import datetime, date, timezone
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Date, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class PaymentMethod(str, enum.Enum):
    cash = "cash"               # Nakit
    bank_transfer = "bank_transfer"  # Havale/EFT
    credit_card = "credit_card"      # Kredi kartı


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    due_id: Mapped[int] = mapped_column(Integer, ForeignKey("dues.id", ondelete="CASCADE"))
    payer_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    amount: Mapped[float] = mapped_column(Float)
    payment_date: Mapped[date] = mapped_column(Date)
    method: Mapped[PaymentMethod] = mapped_column(Enum(PaymentMethod), default=PaymentMethod.cash)
    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), default=PaymentStatus.approved)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    receipt_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    due: Mapped["Due"] = relationship("Due", back_populates="payments")
    payer: Mapped["User | None"] = relationship("User", back_populates="payments")  # noqa: F821
