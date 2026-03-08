from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.announcement import Announcement
from app.models.user import User
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate, AnnouncementOut
from app.core.dependencies import require_manager, get_current_user

router = APIRouter(prefix="/announcements", tags=["Announcements"])


@router.get("/", response_model=list[AnnouncementOut])
async def list_announcements(
    building_id: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    query = select(Announcement)
    if building_id:
        query = query.where(Announcement.building_id == building_id)
    result = await db.execute(
        query.order_by(Announcement.is_pinned.desc(), Announcement.created_at.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
async def create_announcement(
    data: AnnouncementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    ann = Announcement(**data.model_dump(), created_by_id=current_user.id)
    db.add(ann)
    await db.commit()
    await db.refresh(ann)
    return AnnouncementOut.model_validate(ann)


@router.get("/{ann_id}", response_model=AnnouncementOut)
async def get_announcement(
    ann_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Announcement).where(Announcement.id == ann_id))
    ann = result.scalar_one_or_none()
    if not ann:
        raise HTTPException(status_code=404, detail="Duyuru bulunamadı")
    return AnnouncementOut.model_validate(ann)


@router.patch("/{ann_id}", response_model=AnnouncementOut)
async def update_announcement(
    ann_id: int,
    data: AnnouncementUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Announcement).where(Announcement.id == ann_id))
    ann = result.scalar_one_or_none()
    if not ann:
        raise HTTPException(status_code=404, detail="Duyuru bulunamadı")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(ann, field, value)
    await db.commit()
    await db.refresh(ann)
    return AnnouncementOut.model_validate(ann)


@router.delete("/{ann_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_announcement(
    ann_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Announcement).where(Announcement.id == ann_id))
    ann = result.scalar_one_or_none()
    if not ann:
        raise HTTPException(status_code=404, detail="Duyuru bulunamadı")
    await db.delete(ann)
    await db.commit()
