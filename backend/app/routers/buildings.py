from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.building import Building, Block, Apartment
from app.models.user import User
from app.schemas.building import (
    BuildingCreate, BuildingUpdate, BuildingOut,
    BlockCreate, BlockOut,
    ApartmentCreate, ApartmentUpdate, ApartmentOut,
)
from app.core.dependencies import require_manager, get_current_user

router = APIRouter(prefix="/buildings", tags=["Buildings"])


# ── Buildings ──────────────────────────────────────────────────────────────
@router.get("/", response_model=list[BuildingOut])
async def list_buildings(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Building).order_by(Building.id))
    return result.scalars().all()


@router.post("/", response_model=BuildingOut, status_code=status.HTTP_201_CREATED)
async def create_building(
    data: BuildingCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    building = Building(**data.model_dump())
    db.add(building)
    await db.commit()
    await db.refresh(building)
    return BuildingOut.model_validate(building)


@router.get("/{building_id}", response_model=BuildingOut)
async def get_building(
    building_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Building).where(Building.id == building_id))
    building = result.scalar_one_or_none()
    if not building:
        raise HTTPException(status_code=404, detail="Bina bulunamadı")
    return BuildingOut.model_validate(building)


@router.patch("/{building_id}", response_model=BuildingOut)
async def update_building(
    building_id: int,
    data: BuildingUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Building).where(Building.id == building_id))
    building = result.scalar_one_or_none()
    if not building:
        raise HTTPException(status_code=404, detail="Bina bulunamadı")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(building, field, value)
    await db.commit()
    await db.refresh(building)
    return BuildingOut.model_validate(building)


@router.delete("/{building_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_building(
    building_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Building).where(Building.id == building_id))
    building = result.scalar_one_or_none()
    if not building:
        raise HTTPException(status_code=404, detail="Bina bulunamadı")
    await db.delete(building)
    await db.commit()


# ── Blocks ─────────────────────────────────────────────────────────────────
@router.get("/{building_id}/blocks", response_model=list[BlockOut])
async def list_blocks(
    building_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Block).where(Block.building_id == building_id))
    return result.scalars().all()


@router.post("/{building_id}/blocks", response_model=BlockOut, status_code=201)
async def create_block(
    building_id: int,
    data: BlockCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    block = Block(name=data.name, building_id=building_id)
    db.add(block)
    await db.commit()
    await db.refresh(block)
    return BlockOut.model_validate(block)
