from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.due import Due, DueStatus
from app.models.building import Block, Apartment
from app.models.user import User
from app.schemas.due import DueCreate, DueBulkCreate, DueUpdate, DueOut
from app.core.dependencies import require_manager, get_current_user

router = APIRouter(prefix="/dues", tags=["Dues"])


@router.get("/", response_model=list[DueOut])
async def list_dues(
    apartment_id: int | None = Query(None),
    status: DueStatus | None = Query(None),
    year: int | None = Query(None),
    month: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Due)
    if apartment_id:
        query = query.where(Due.apartment_id == apartment_id)
    if status:
        query = query.where(Due.status == status)
    if year:
        query = query.where(Due.period_year == year)
    if month:
        query = query.where(Due.period_month == month)
    result = await db.execute(query.order_by(Due.id.desc()))
    return result.scalars().all()


@router.post("/", response_model=DueOut, status_code=status.HTTP_201_CREATED)
async def create_due(
    data: DueCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    due = Due(**data.model_dump())
    db.add(due)
    await db.commit()
    await db.refresh(due)
    return DueOut.model_validate(due)


@router.post("/bulk", response_model=list[DueOut], status_code=status.HTTP_201_CREATED)
async def create_bulk_dues(
    data: DueBulkCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    """Bir binadaki tüm dairelere aynı aidat dönemini toplu oluştur."""
    # Binadaki tüm daireleri bul
    result = await db.execute(
        select(Apartment).join(Block).where(Block.building_id == data.building_id)
    )
    apartments = result.scalars().all()
    if not apartments:
        raise HTTPException(status_code=404, detail="Bu binada hiç daire bulunamadı")

    dues = []
    for apt in apartments:
        due = Due(
            apartment_id=apt.id,
            period_year=data.period_year,
            period_month=data.period_month,
            amount=data.amount,
            due_date=data.due_date,
            description=data.description,
        )
        db.add(due)
        dues.append(due)

    await db.commit()
    for d in dues:
        await db.refresh(d)
    return [DueOut.model_validate(d) for d in dues]


@router.get("/{due_id}", response_model=DueOut)
async def get_due(
    due_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Due).where(Due.id == due_id))
    due = result.scalar_one_or_none()
    if not due:
        raise HTTPException(status_code=404, detail="Aidat bulunamadı")
    return DueOut.model_validate(due)


@router.patch("/{due_id}", response_model=DueOut)
async def update_due(
    due_id: int,
    data: DueUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Due).where(Due.id == due_id))
    due = result.scalar_one_or_none()
    if not due:
        raise HTTPException(status_code=404, detail="Aidat bulunamadı")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(due, field, value)
    await db.commit()
    await db.refresh(due)
    return DueOut.model_validate(due)


@router.delete("/{due_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_due(
    due_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Due).where(Due.id == due_id))
    due = result.scalar_one_or_none()
    if not due:
        raise HTTPException(status_code=404, detail="Aidat bulunamadı")
    await db.delete(due)
    await db.commit()
