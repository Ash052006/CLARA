import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from auth.dependencies import require_auth
from auth.routes import router as auth_router
from config.logging_config import configure_logging
from config.settings import settings
from runtime import get_conversation_manager
from security.rate_limit import RateLimitMiddleware
from voice.routes import router as voice_router

configure_logging()

logger = logging.getLogger("clara.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "starting CLARA backend environment=%s auth_enabled=%s demo_mode=%s",
        settings.environment,
        settings.auth_enabled,
        settings.demo_mode,
    )

    if settings.auth_enabled and not settings.owner_password_hash:
        logger.error(
            "AUTH_ENABLED is true but OWNER_PASSWORD_HASH is not set; "
            "login will fail until it is configured"
        )

    if settings.jwt_secret_generated:
        logger.warning(
            "JWT_SECRET is not set; using an ephemeral secret. "
            "Tokens will be invalidated on every restart."
        )

    if settings.database_url:
        try:
            from memory import database

            if database.init_database():
                logger.info("PostgreSQL memory enabled")
            else:
                logger.warning(
                    "DATABASE_URL is set but the database could not be initialized"
                )
        except Exception:
            logger.exception("database initialization failed")

    if settings.warmup:
        try:
            get_conversation_manager()
            logger.info("warmup complete")
        except Exception:
            logger.exception("warmup failed")

    yield

    try:
        from memory import database

        database.close_database()
    except Exception:
        logger.exception("error while closing database connections")

    logger.info("CLARA backend shutdown complete")


app = FastAPI(
    title="CLARA API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.enable_docs else None,
    redoc_url="/redoc" if settings.enable_docs else None,
    openapi_url="/openapi.json" if settings.enable_docs else None,
)

_cors_origins = settings.cors_origins

if settings.is_production and "*" in _cors_origins:
    logger.error(
        "Wildcard CORS is not allowed in production; "
        "set CORS_ORIGINS to your Netlify/custom-domain origins"
    )
    _cors_origins = [origin for origin in _cors_origins if origin != "*"]

_allow_all_origins = "*" in _cors_origins

# Rate limiting is added first so CORS remains the outermost middleware and
# can decorate 429 responses with the correct CORS headers.
app.add_middleware(RateLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _allow_all_origins else _cors_origins,
    allow_credentials=(
        settings.cors_allow_credentials and not _allow_all_origins
    ),
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth_router)
app.include_router(voice_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):

    logger.exception(
        "unhandled exception path=%s method=%s",
        request.url.path,
        request.method,
        extra={"path": request.url.path, "method": request.method},
    )

    detail = "Internal server error"

    if not settings.is_production:
        detail = f"{type(exc).__name__}: {exc}"

    return JSONResponse(status_code=500, content={"detail": detail})


@app.get("/")
def home():
    return {"message": "CLARA is alive"}


@app.get("/health")
def health(response: Response):

    database_status = "not_configured"

    if settings.database_url:
        try:
            from memory import database

            database_status = "ok" if database.check_database() else "error"
        except Exception:
            logger.exception("health check failed")
            database_status = "error"

    status = "degraded" if database_status == "error" else "ok"

    if (
        settings.is_production
        and settings.memory_backend == "database"
        and database_status != "ok"
    ):
        response.status_code = 503
        status = "error"

    return {
        "status": status,
        "service": "clara-backend",
        "environment": settings.environment,
        "version": app.version,
        "database": database_status,
    }


@app.get("/chat/{message}", dependencies=[Depends(require_auth)])
def chat(message: str):
    return get_conversation_manager().process_message(message)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        log_level=settings.log_level.lower(),
    )
