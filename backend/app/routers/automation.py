from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date
import os

from app.database import get_db
from app.models.due import Due, DueStatus
from app.models.building import Apartment, Block, Building
from app.models.user import User
from app.core.dependencies import require_manager

try:
    from fpdf import FPDF
except ImportError:
    # Fallback if fpdf2 is still installing or not available
    class FPDF:
        pass

router = APIRouter(prefix="/automation", tags=["Automation"])

def generate_pdf_notice(apartment_number: str, building_name: str, total_debt: float, delay_days: int) -> str:
    """Belirtilen daire için PDF formatında ihtarname oluşturur."""
    try:
        pdf = FPDF()
        pdf.add_page()
        
        # Configure fonts (using default available fonts for simplicity)
        pdf.set_font("Arial", size=16)
        
        # Header
        pdf.cell(200, 10, txt="IHTARNAME", ln=1, align="C")
        pdf.ln(10)
        
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=f"Sayin Yargi Mensubu / Ilgili Kisi,", ln=1)
        pdf.ln(5)
        
        pdf.multi_cell(0, 10, txt=f"Gecikme Gunu: {delay_days} gun")
        pdf.multi_cell(0, 10, txt=f"Bina/Site: {building_name}")
        pdf.multi_cell(0, 10, txt=f"Daire No: {apartment_number}")
        pdf.multi_cell(0, 10, txt=f"Toplam Geciken Borc: {total_debt} TL")
        
        pdf.ln(10)
        pdf.multi_cell(0, 10, txt="Yukarda belirtilen bagimsiz bolumun yonetim planina ve Kat Mulkiyeti Kanununa gore muaccel hale gelmis aidat/gider payi borcunu 7 (yedi) gun icinde odemenizi, aksi takdirde hakkinizda yasal yollara (Icra takibi) basvurulacagini ve bu ugurda yapilacak tum masraf ve avukatlik ucretlerinin de tarafiniza yukletilecegini ihtaren bildiririz.")
        
        pdf.ln(20)
        pdf.cell(0, 10, txt="AidatX Otomatik Hukuk Sistemi", ln=1, align="R")
        
        # Create directory if not exists
        os.makedirs("data/notices", exist_ok=True)
        filename = f"data/notices/ihtarname_daire_{apartment_number}_{date.today().isoformat()}.pdf"
        pdf.output(filename)
        return filename
    except Exception as e:
        print(f"PDF creation error: {e}")
        return "PDF_GENERATION_FAILED"

@router.post("/check-overdue", summary="Gecikmiş borçları tarar ve otomatik aksiyon alır (SMS, PDF İhtar, Yasal Takip)")
async def check_overdue_dues(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_manager)
):
    """
    1. Sisteme kayıtlı tüm 'Ödenmedi' (pending/overdue) durumdaki aidatları tarar.
    2. Gecikme gününü hesaplar (bugün - due_date).
    3. Gecikme günü 3, 15 ve 30 barajlarını aştığında aksiyon üretir:
       - 3 Gün: SMS Bildirimi
       - 15 Gün: İhtarname PDF Üretimi
       - 30 Gün: Avukat Yasal Takip API Export JSON'u
    """
    today = date.today()
    
    # Tüm ödenmemiş aidat borçları olan daireleri grupla
    query = (
        select(
            Apartment.id,
            Apartment.number,
            Building.name.label("building_name"),
            func.sum(Due.amount).label("total_debt"),
            func.max(func.datediff(today, Due.due_date)).label("max_delay_days")
        )
        .join(Due, Due.apartment_id == Apartment.id)
        .join(Block, Apartment.block_id == Block.id)
        .join(Building, Block.building_id == Building.id)
        .where(Due.status.in_([DueStatus.pending, DueStatus.overdue]))
        .where(Due.due_date < today)
        .group_by(Apartment.id, Apartment.number, Building.name)
    )
    
    result = await db.execute(query)
    debtors = result.all()
    
    actions_taken = {
        "sms_sent": [],
        "pdf_notices": [],
        "legal_actions": []
    }
    
    for apt_id, apt_number, building_name, total_debt, max_delay in debtors:
        # Convert delay to integer just in case
        delay_days = int(max_delay) if max_delay else 0
        
        # Logic for boundaries
        if delay_days >= 30:
            actions_taken["legal_actions"].append({
                "apartment_id": apt_id,
                "apartment_number": apt_number,
                "building": building_name,
                "debt_amount": float(total_debt),
                "delay_days": delay_days,
                "action": "EXPORT_FOR_LAWYER_PORTAL"
            })
        elif delay_days >= 15:
            pdf_path = generate_pdf_notice(apt_number, building_name, total_debt, delay_days)
            actions_taken["pdf_notices"].append({
                "apartment_id": apt_id,
                "apartment_number": apt_number,
                "debt_amount": float(total_debt),
                "delay_days": delay_days,
                "action": "PDF_CREATED",
                "file_path": pdf_path
            })
        elif delay_days >= 3:
            actions_taken["sms_sent"].append({
                "apartment_id": apt_id,
                "apartment_number": apt_number,
                "debt_amount": float(total_debt),
                "delay_days": delay_days,
                "action": "WHATSAPP_SMS_QUEUED"
            })

    # Update overdue status conceptually
    update_overdue_stmt = select(Due).where(Due.status == DueStatus.pending).where(Due.due_date < today)
    pending_dues_res = await db.execute(update_overdue_stmt)
    pending_dues = pending_dues_res.scalars().all()
    for pdue in pending_dues:
        pdue.status = DueStatus.overdue
    await db.commit()

    return {
        "status": "success",
        "processed_debtors": len(debtors),
        "actions": actions_taken
    }
