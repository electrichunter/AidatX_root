from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactMessageCreate, ContactMessageResponse
from app.core.dependencies import require_manager

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("/", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
async def create_contact_message(
    message_in: ContactMessageCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Sisteme giriş yapmamış kişilerin mesaj göndermesi (Açık Uç Nokta).
    """
    new_message = ContactMessage(
        full_name=message_in.full_name,
        email=message_in.email,
        subject=message_in.subject,
        message=message_in.message,
    )
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)
    return new_message


@router.get("/", response_model=List[ContactMessageResponse])
async def list_contact_messages(
    db: AsyncSession = Depends(get_db),
    _=Depends(require_manager),
):
    """
    Yöneticilerin gelen mesajları görüntülemesi.
    """
    result = await db.execute(select(ContactMessage).order_by(ContactMessage.created_at.desc()))
    return result.scalars().all()


@router.patch("/{message_id}/read", response_model=ContactMessageResponse)
async def mark_message_as_read(
    message_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_manager),
):
    """
    Yöneticilerin mesajı okundu olarak işaretlemesi.
    """
    result = await db.execute(select(ContactMessage).where(ContactMessage.id == message_id))
    message = result.scalar_one_or_none()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mesaj bulunamadı")

    message.is_read = True
    await db.commit()
    await db.refresh(message)
    return message


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact_message(
    message_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_manager),
):
    """
    Yöneticilerin mesajı silmesi.
    """
    result = await db.execute(select(ContactMessage).where(ContactMessage.id == message_id))
    message = result.scalar_one_or_none()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mesaj bulunamadı")

    await db.delete(message)
    await db.commit()
