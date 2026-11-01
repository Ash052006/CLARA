"""Central configuration for CLARA.

All values are read from environment variables so the same code base can run
locally, on Render, and inside the Tauri desktop application. Secrets are only
ever read on the backend.
"""

import os
import secrets
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent

# Load local dotenv files without overriding real environment variables.
# Root .env is used for shared infrastructure values (e.g. DATABASE_URL),
# backend/.env for backend-only secrets (e.g. GROQ_API_KEY).
load_dotenv(PROJECT_ROOT / ".env", override=False)
load_dotenv(BACKEND_DIR / ".env", override=False)

_TRUE_VALUES = {"1", "true", "yes", "on"}


def _as_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in _TRUE_VALUES


def _as_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


def _as_float(name: str, default: float) -> float:
    raw = os.getenv(name)
    if not raw:
        return default
    try:
        return float(raw)
    except ValueError:
        return default


def _as_list(name: str, default: str) -> list:
    raw = os.getenv(name) or default
    return [item.strip() for item in raw.split(",") if item.strip()]


def _as_path(name: str, default) -> Path:
    raw = os.getenv(name, "").strip()
    return Path(raw if raw else default).expanduser()


def _as_str(name: str, default: str) -> str:
    return os.getenv(name, "").strip() or default


def _normalize_database_url(url: str) -> str:
    """Render/Heroku expose postgres://; SQLAlchemy expects postgresql://."""
    if url.startswith("postgres://"):
        return "postgresql://" + url[len("postgres://") :]
    return url


class Settings:
    def __init__(self) -> None:
        self.backend_dir = BACKEND_DIR
        self.project_root = PROJECT_ROOT

        self.environment = os.getenv("ENVIRONMENT", "development").strip().lower()
        self.is_production = self.environment in {"production", "prod"}

        self.host = os.getenv("HOST", "0.0.0.0")
        self.port = _as_int("PORT", 8001)
        self.log_level = os.getenv("LOG_LEVEL", "INFO").upper()

        self.cors_origins = _as_list(
            "CORS_ORIGINS",
            (
                "http://localhost:8000,http://127.0.0.1:8000,"
                "http://localhost:1420,http://127.0.0.1:1420,"
                "http://tauri.localhost,https://tauri.localhost,tauri://localhost"
            ),
        )
        self.cors_allow_credentials = _as_bool("CORS_ALLOW_CREDENTIALS", False)

        self.database_url = _normalize_database_url(
            os.getenv("DATABASE_URL", "").strip()
        )
        self.memory_backend = os.getenv("MEMORY_BACKEND", "auto").strip().lower()
        self.db_pool_size = _as_int("DB_POOL_SIZE", 5)
        self.db_max_overflow = _as_int("DB_MAX_OVERFLOW", 5)
        self.db_pool_recycle = _as_int("DB_POOL_RECYCLE", 1800)

        self.storage_dir = _as_path("STORAGE_DIR", BACKEND_DIR / "storage")
        self.memory_file = _as_path(
            "MEMORY_FILE", self.storage_dir / "memory.json"
        )

        self.groq_api_key = os.getenv("GROQ_API_KEY", "").strip()
        self.groq_model = _as_str("GROQ_MODEL", "openai/gpt-oss-120b")
        self.groq_timeout = _as_float("GROQ_TIMEOUT", 60.0)
        self.groq_max_retries = _as_int("GROQ_MAX_RETRIES", 2)

        self.intent_classifier_enabled = _as_bool(
            "INTENT_CLASSIFIER_ENABLED", False
        )
        self.intent_model = _as_str(
            "INTENT_MODEL", "valhalla/distilbart-mnli-12-3"
        )

        self.voice_enabled = _as_bool("VOICE_ENABLED", False)
        self.whisper_model = _as_str("WHISPER_MODEL", "base")
        self.whisper_device = _as_str("WHISPER_DEVICE", "cpu")
        self.whisper_compute_type = _as_str("WHISPER_COMPUTE_TYPE", "int8")

        self.google_credentials_file = _as_path(
            "GOOGLE_CREDENTIALS_FILE", BACKEND_DIR / "credentials.json"
        )
        self.google_credentials_json = os.getenv("GOOGLE_CREDENTIALS_JSON", "").strip()
        self.gmail_token_file = _as_path(
            "GMAIL_TOKEN_FILE", BACKEND_DIR / "gmail_token.json"
        )
        self.gmail_token_json = os.getenv("GMAIL_TOKEN_JSON", "").strip()
        self.google_calendar_token_file = _as_path(
            "GOOGLE_CALENDAR_TOKEN_FILE", BACKEND_DIR / "token.json"
        )
        self.google_calendar_token_json = os.getenv(
            "GOOGLE_CALENDAR_TOKEN_JSON", ""
        ).strip()
        self.google_oauth_interactive = _as_bool(
            "GOOGLE_OAUTH_INTERACTIVE", not self.is_production
        )

        self.warmup = _as_bool("CLARA_WARMUP", False)

        # Single-user authentication
        self.auth_enabled = _as_bool("AUTH_ENABLED", True)
        self.owner_password_hash = os.getenv("OWNER_PASSWORD_HASH", "").strip()
        self.jwt_secret = os.getenv("JWT_SECRET", "").strip()
        self.jwt_secret_generated = False
        if not self.jwt_secret:
            # Ephemeral fallback keeps local development usable. Production must
            # set JWT_SECRET so tokens survive restarts.
            self.jwt_secret = secrets.token_urlsafe(48)
            self.jwt_secret_generated = True
        self.jwt_algorithm = "HS256"
        self.access_token_minutes = _as_int("AUTH_ACCESS_TOKEN_MINUTES", 15)
        self.refresh_token_days = _as_int("AUTH_REFRESH_TOKEN_DAYS", 7)

        # Demo mode
        self.demo_mode = _as_bool("DEMO_MODE", False)

        # Rate limiting (in-process, single Render instance)
        self.login_rate_limit = _as_int("LOGIN_RATE_LIMIT", 5)
        self.login_rate_window = _as_int("LOGIN_RATE_WINDOW_SECONDS", 900)
        self.api_rate_limit = _as_int("RATE_LIMIT_REQUESTS", 60)
        self.api_rate_window = _as_int("RATE_LIMIT_WINDOW_SECONDS", 60)

        self.enable_docs = _as_bool("ENABLE_DOCS", not self.is_production)

    @property
    def auth_configured(self) -> bool:
        return not self.auth_enabled or bool(self.owner_password_hash)

    @property
    def use_database(self) -> bool:
        return self.memory_backend in {"auto", "database"} and bool(self.database_url)

    @property
    def memory_uses_database(self) -> bool:
        if self.memory_backend == "json":
            return False
        if self.memory_backend == "database":
            return bool(self.database_url)
        return bool(self.database_url)


settings = Settings()
