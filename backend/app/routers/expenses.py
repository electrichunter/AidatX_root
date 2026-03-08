from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseOut
from app.core.dependencies import require_manager, get_current_user

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("/", response_model=list[ExpenseOut])
async def list_expenses(
    building_id: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    query = select(Expense)
    if building_id:
        query = query.where(Expense.building_id == building_id)
    result = await db.execute(query.order_by(Expense.expense_date.desc()))
    return result.scalars().all()


@router.post("/", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
async def create_expense(
    data: ExpenseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    expense = Expense(**data.model_dump(), created_by_id=current_user.id)
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    return ExpenseOut.model_validate(expense)


@router.get("/{expense_id}", response_model=ExpenseOut)
async def get_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Expense).where(Expense.id == expense_id))
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Gider bulunamadı")
    return ExpenseOut.model_validate(expense)


@router.patch("/{expense_id}", response_model=ExpenseOut)
async def update_expense(
    expense_id: int,
    data: ExpenseUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Expense).where(Expense.id == expense_id))
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Gider bulunamadı")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(expense, field, value)
    await db.commit()
    await db.refresh(expense)
    return ExpenseOut.model_validate(expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Expense).where(Expense.id == expense_id))
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Gider bulunamadı")
    await db.delete(expense)
    await db.commit()
