import logging

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, Field
import jwt

from auth import security, store
from auth.dependencies import require_auth
from config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=256)


class RefreshRequest(BaseModel):
    refresh_token: str = Field(..., min_length=10, max_length=512)


def _issue_tokens() -> dict:
    access_token = security.create_access_token()
    refresh_token = security.generate_refresh_token()
    store.save_refresh(
        security.hash_refresh_token(refresh_token), security.refresh_expiry()
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.access_token_minutes * 60,
        "refresh_token": refresh_token,
        "refresh_expires_in": settings.refresh_token_days * 86400,
        "demo_mode": settings.demo_mode,
    }


@router.get("/config")
def auth_config():
    """Public, non-sensitive information for the frontend login gate."""

    return {
        "auth_enabled": settings.auth_enabled,
        "auth_configured": settings.auth_configured,
        "demo_mode": settings.demo_mode,
        "voice_enabled": settings.voice_enabled,
        "version": "1.0.0",
    }


@router.post("/login")
def login(payload: LoginRequest, request: Request, response: Response):

    response.headers["Cache-Control"] = "no-store"

    if not settings.auth_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authentication is disabled on this deployment.",
        )

    if not settings.owner_password_hash:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication is not configured on the server.",
        )

    if not security.verify_password(payload.password, settings.owner_password_hash):
        client_ip = request.client.host if request.client else "unknown"
        logger.warning("failed login attempt client_ip=%s", client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return _issue_tokens()


@router.post("/refresh")
def refresh(payload: RefreshRequest, response: Response):

    response.headers["Cache-Control"] = "no-store"

    if not settings.auth_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authentication is disabled on this deployment.",
        )

    token_hash = security.hash_refresh_token(payload.refresh_token)

    if not store.consume_refresh(token_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is invalid or expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return _issue_tokens()


@router.post("/logout")
def logout(payload: RefreshRequest):

    store.revoke_refresh(security.hash_refresh_token(payload.refresh_token))

    return {"detail": "Logged out"}


@router.get("/me")
def me(claims: dict = Depends(require_auth)):

    return {
        "authenticated": True,
        "subject": claims.get("sub"),
        "demo_mode": settings.demo_mode,
        "voice_enabled": settings.voice_enabled,
    }


@router.post("/logout-all")
def logout_all(_: dict = Depends(require_auth)):

    store.revoke_all()

    return {"detail": "All sessions revoked"}
