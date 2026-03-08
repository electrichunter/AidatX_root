from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = "mysql+aiomysql://aidatx_user:aidatx_password@db/aidatx_db"

    # Redis
    redis_url: str = "redis://redis:6379/0"

    # Security
    secret_key: str = "supersecret_change_this_for_production_12345"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Admin seed
    admin_username: str = "admin"
    admin_email: str = "admin@aidatx.com"
    admin_password: str = "Admin@123_secure"

    # App
    app_env: str = "development"
    app_title: str = "AidatX API"
    app_version: str = "1.0.0"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
