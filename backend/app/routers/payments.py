from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.payment import Payment
from app.models.due import Due, DueStatus
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentOut
from app.core.dependencies import require_manager, get_current_user

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/", response_model=list[PaymentOut])
async def list_payments(
    due_id: int | None = Query(None),
    payer_id: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    query = select(Payment)
    if due_id:
        query = query.where(Payment.due_id == due_id)
    if payer_id:
        query = query.where(Payment.payer_id == payer_id)
    result = await db.execute(query.order_by(Payment.id.desc()))
    return result.scalars().all()


@router.post("/", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
async def create_payment(
    data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Aidatı kontrol et
    due_result = await db.execute(select(Due).where(Due.id == data.due_id))
    due = due_result.scalar_one_or_none()
    if not due:
        raise HTTPException(status_code=404, detail="Aidat bulunamadı")

    payment = Payment(
        **data.model_dump(),
        payer_id=current_user.id,
    )
    db.add(payment)

    # Ödeme durumunu güncelle
    due.status = DueStatus.paid
    await db.commit()
    await db.refresh(payment)
    return PaymentOut.model_validate(payment)


@router.get("/{payment_id}", response_model=PaymentOut)
async def get_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Ödeme bulunamadı")
    return PaymentOut.model_validate(payment)


@router.patch("/{payment_id}", response_model=PaymentOut)
async def update_payment(
    payment_id: int,
    data: PaymentUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Ödeme bulunamadı")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(payment, field, value)
    await db.commit()
    await db.refresh(payment)
    return PaymentOut.model_validate(payment)


@router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager),
):
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Ödeme bulunamadı")
    await db.delete(payment)
    await db.commit()
