from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from app.config import settings
from app.database import create_tables, AsyncSessionLocal
from app.models.user import User
from app.models.role import Role, Permission
from app.core.security import hash_password
from app.routers import auth, users, buildings, apartments, dues, payments, expenses, announcements, reports, contact


async def seed_roles_and_admin():
    """İlk açılışta Role ve taban yetkileri yoksa oluştur ve Admin user seed et."""
    async with AsyncSessionLocal() as db:
        # Seed Permissions
        permissions_data = [
            {"name": "manage_buildings", "description": "Bina ve daireleri yönetir"},
            {"name": "manage_users", "description": "Kullanıcı (sakinleri) yönetir"},
            {"name": "manage_dues", "description": "Aidat borçlandırması ve takibi yapar"},
            {"name": "manage_payments", "description": "Ödeme onaylama ve inceleme yapar"},
            {"name": "view_reports", "description": "Raporlara ve tablolara erişir"},
            {"name": "manage_system", "description": "Sistem admin ayarları (tam yetki)"},
        ]
        
        db_perms = {}
        for p_data in permissions_data:
            result = await db.execute(select(Permission).where(Permission.name == p_data["name"]))
            db_p = result.scalar_one_or_none()
            if not db_p:
                db_p = Permission(name=p_data["name"], description=p_data["description"])
                db.add(db_p)
            db_perms[p_data["name"]] = db_p

        await db.flush()

        # Seed Roles
        roles_data = [
            {
                "name": "admin", 
                "description": "Sistem Yöneticisi", 
                "perms": [p["name"] for p in permissions_data]
            },
            {
                "name": "manager", 
                "description": "Bina Yöneticisi", 
                "perms": ["manage_buildings", "manage_users", "manage_dues", "manage_payments", "view_reports"]
            },
            {
                "name": "resident", 
                "description": "Sistem Sakini / Daire Sahibi", 
                "perms": []
            },
        ]

        db_roles = {}
        for r_data in roles_data:
            result = await db.execute(select(Role).where(Role.name == r_data["name"]))
            db_r = result.scalar_one_or_none()
            if not db_r:
                db_r = Role(name=r_data["name"], description=r_data["description"])
                db_r.permissions = [db_perms[p_name] for p_name in r_data["perms"]]
                db.add(db_r)
            db_roles[r_data["name"]] = db_r
            
        await db.flush()

        # Seed Admin User
        result = await db.execute(select(User).where(User.email == settings.admin_email))
        existing_admin = result.scalar_one_or_none()
        if not existing_admin:
            admin_user = User(
                full_name="Admin",
                email=settings.admin_email,
                phone=None,
                hashed_password=hash_password(settings.admin_password),
                role_id=db_roles["admin"].id,
                is_active=True,
            )
            db.add(admin_user)

        await db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: tabloları oluştur ve rolleri/admini seed et
    await create_tables()
    await seed_roles_and_admin()
    yield
    # Shutdown


app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description="AidatX — Apartman ve Site Aidat Yönetim Sistemi API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router kayıtları
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(buildings.router)
app.include_router(apartments.router)
app.include_router(dues.router)
app.include_router(payments.router)
app.include_router(expenses.router)
app.include_router(announcements.router)
app.include_router(reports.router)
app.include_router(contact.router)

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": settings.app_title, "version": settings.app_version}
