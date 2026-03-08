from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.building import Apartment
from app.models.user import User
from app.schemas.building import ApartmentCreate, ApartmentUpdate, ApartmentOut
from app.core.dependencies import require_manager, get_current_user

router = APIRouter(prefix="/apartments", tags=["Apartments"])


@router.get("/", response_model=list[ApartmentOut])
async def list_apartments(
    block_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    query = select(Apartment)
    if block_id:
        query = query.where(Apartment.block_id == block_id)
    result = await db.execute(query.order_by(Apartment.id))
    return result.scalars().all()


@router.post("/", response_model=ApartmentOut, status_code=status.HTTP_201_CREATED)
async def create_apartment(
    data: ApartmentCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    apt = Apartment(**data.model_dump())
    if apt.resident_id:
        apt.is_occupied = True
    db.add(apt)
    await db.commit()
    await db.refresh(apt)
    return ApartmentOut.model_validate(apt)


@router.get("/{apartment_id}", response_model=ApartmentOut)
async def get_apartment(
    apartment_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Apartment).where(Apartment.id == apartment_id))
    apt = result.scalar_one_or_none()
    if not apt:
        raise HTTPException(status_code=404, detail="Daire bulunamadı")
    return ApartmentOut.model_validate(apt)


@router.patch("/{apartment_id}", response_model=ApartmentOut)
async def update_apartment(
    apartment_id: int,
    data: ApartmentUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Apartment).where(Apartment.id == apartment_id))
    apt = result.scalar_one_or_none()
    if not apt:
        raise HTTPException(status_code=404, detail="Daire bulunamadı")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(apt, field, value)
    if apt.resident_id:
        apt.is_occupied = True
    await db.commit()
    await db.refresh(apt)
    return ApartmentOut.model_validate(apt)


@router.delete("/{apartment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_apartment(
    apartment_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Apartment).where(Apartment.id == apartment_id))
    apt = result.scalar_one_or_none()
    if not apt:
        raise HTTPException(status_code=404, detail="Daire bulunamadı")
    await db.delete(apt)
    await db.commit()
