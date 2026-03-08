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
from datetime import datetime, date, timedelta
from calendar import monthrange

router = APIRouter(prefix="/reports", tags=["Reports"])

class PredictiveSummary(BaseModel):
    current_balance: float
    expected_income_next_month: float
    predicted_expense_next_month: float
    inflation_rate_applied: float
    net_predicted_balance: float
    warning_message: str | None
    recommendation: str | None


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


@router.get("/predictive", response_model=PredictiveSummary)
async def get_predictive_cashflow(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
):
    """Gelecek ayin muhtemel giderlerini son harcamalara ve enflasyona gore hesaplayip uyari uretir."""
    
    # 1. Mevcut Kasa = Toplam Tahsilat - Toplam Gider
    paid_sum = (await db.execute(select(func.sum(Payment.amount)))).scalar() or 0.0
    expense_sum = (await db.execute(select(func.sum(Expense.amount)))).scalar() or 0.0
    current_balance = paid_sum - expense_sum
    
    # 2. Beklenen Gelir (Gelecek Ay Tahsil Edilecek Standart Aidatlar)
    # Varsayim: Bu ayin aidat toplamı kabaca onumuzdeki ayin beklenen geliridir
    today = date.today()
    current_dues_sum = (await db.execute(
        select(func.sum(Due.amount))
        .where(Due.period_month == today.month)
        .where(Due.period_year == today.year)
    )).scalar() or 0.0
    
    # Eger hic aidat yoksa ortalama bir rakam bulalim(sistem bos oldugunda cokertmemesi icin)
    if current_dues_sum == 0.0:
        current_dues_sum = (await db.execute(select(func.sum(Due.amount)))).scalar() or 0.0
        # Bolu max(dönem) vs yapılabilir ama demo icin basit average tutari kullanalim
        # Ya da basitce son kaydedilen aidatin limitini alip daire sayisiyla carpalim
        
        apt_count = (await db.execute(select(func.count(Apartment.id)))).scalar() or 0
        if apt_count > 0 and current_dues_sum == 0.0:
            current_dues_sum = apt_count * 500.0 # fallback

    # 3. Gelecek Ay Tahmini Gideri:
    # Son 3 ayin gider ortalamasini al
    three_months_ago = today - timedelta(days=90)
    recent_expense_avg = (await db.execute(
        select(func.sum(Expense.amount))
        .where(Expense.expense_date >= three_months_ago)
    )).scalar() or 0.0
    
    monthly_expense_avg = recent_expense_avg / 3.0
    if monthly_expense_avg == 0:
        # Fallback for empty systems
        monthly_expense_avg = current_dues_sum * 0.8
    
    # Enflasyon / Enerji Zammi (Ornegin Kis Aylari & Genel Zam -> %15)
    inflation_rate = 0.15
    predicted_expense = monthly_expense_avg * (1 + inflation_rate)
    
    # 4. Kriz Kontrolu ve Uyari
    net_predicted_balance = current_balance + current_dues_sum - predicted_expense
    
    warning_message = None
    recommendation = None
    
    if net_predicted_balance < 0:
        warning_message = "DIKKAT: Mevcut kasa ve planlanan aidat gelirleri, gelecek ayin tahmin edilen giderleri karsisinda {abs(net_predicted_balance):.2f} TL acik verebilir."
        increase_needed = abs(net_predicted_balance) / current_dues_sum if current_dues_sum > 0 else 0
        recommendation = f"Kasa acigini kapatmak icin yeni donemde aidatlara ortalama %{int(increase_needed * 100) + 1} artis yapilmasi onerilmektedir."
    elif net_predicted_balance < (predicted_expense * 0.1):
        warning_message = "UYARI: Kasa bakiyeniz kritik seviyeye kadar dusebilir. Beklenmedik bakim/onari masraflari icin fon yetmeyebilir."
        recommendation = "Aidatlarda kucuk bir (%5-10) iyilestirme dusunun veya gereksiz ortak harcamalari kisin."
    else:
        recommendation = "Nakit akisiniz saglikli gorunuyor. Herhangi bir ekstra artisa ihtiyac yok."

    return PredictiveSummary(
        current_balance=current_balance,
        expected_income_next_month=current_dues_sum,
        predicted_expense_next_month=predicted_expense,
        inflation_rate_applied=inflation_rate,
        net_predicted_balance=net_predicted_balance,
        warning_message=warning_message,
        recommendation=recommendation
    )
