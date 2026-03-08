from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from app.database import get_db
from app.models.building import Building, Block, Apartment
from app.models.due import Due, DueStatus
from app.models.payment import Payment
from app.models.expense import Expense
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])


class DashboardSummary(BaseModel):
    total_buildings: int
    total_apartments: int
    total_dues_amount: float
    total_collected: float
    total_overdue: float
    pending_count: int
    overdue_count: int
    total_expenses: float


class DebtorItem(BaseModel):
    apartment_id: int
    apartment_number: str
    block_name: str
    building_name: str
    total_debt: float
    due_count: int


@router.get("/summary", response_model=DashboardSummary)
async def get_summary(
    building_id: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    # Binaları say
    building_q = select(func.count(Building.id))
    apt_q = select(func.count(Apartment.id))

    if building_id:
        apt_q = apt_q.join(Block).where(Block.building_id == building_id)

    total_buildings = (await db.execute(building_q)).scalar() or 0
    total_apartments = (await db.execute(apt_q)).scalar() or 0

    # Aidat toplamları
    due_q = select(func.sum(Due.amount), func.count(Due.id)).where(Due.status == DueStatus.pending)
    overdue_q = select(func.sum(Due.amount), func.count(Due.id)).where(Due.status == DueStatus.overdue)
    paid_q = select(func.sum(Payment.amount))

    pending_sum, pending_count = (await db.execute(due_q)).one()
    overdue_sum, overdue_count = (await db.execute(overdue_q)).one()
    paid_sum = (await db.execute(paid_q)).scalar()
    expense_sum = (await db.execute(select(func.sum(Expense.amount)))).scalar()

    return DashboardSummary(
        total_buildings=total_buildings,
        total_apartments=total_apartments,
        total_dues_amount=(pending_sum or 0) + (overdue_sum or 0),
        total_collected=paid_sum or 0,
        total_overdue=overdue_sum or 0,
        pending_count=pending_count or 0,
        overdue_count=overdue_count or 0,
        total_expenses=expense_sum or 0,
    )


@router.get("/debtors", response_model=list[DebtorItem])
async def get_debtors(
    building_id: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    query = (
        select(
            Apartment.id,
            Apartment.number,
            Block.name.label("block_name"),
            Building.name.label("building_name"),
            func.sum(Due.amount).label("total_debt"),
            func.count(Due.id).label("due_count"),
        )
        .join(Due, Due.apartment_id == Apartment.id)
        .join(Block, Apartment.block_id == Block.id)
        .join(Building, Block.building_id == Building.id)
        .where(Due.status.in_([DueStatus.pending, DueStatus.overdue]))
        .group_by(Apartment.id, Apartment.number, Block.name, Building.name)
        .order_by(func.sum(Due.amount).desc())
    )
    if building_id:
        query = query.where(Building.id == building_id)

    result = await db.execute(query)
    rows = result.all()
    return [
        DebtorItem(
            apartment_id=r.id,
            apartment_number=r.number,
            block_name=r.block_name,
            building_name=r.building_name,
            total_debt=r.total_debt,
            due_count=r.due_count,
        )
        for r in rows
    ]
