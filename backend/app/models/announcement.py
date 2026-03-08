from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Announcement(Base):
    __tablename__ = "announcements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    building_id: Mapped[int] = mapped_column(Integer, ForeignKey("buildings.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(300))
    content: Mapped[str] = mapped_column(Text)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False)
    created_by_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    building: Mapped["Building"] = relationship("Building", back_populates="announcements")  # noqa: F821
