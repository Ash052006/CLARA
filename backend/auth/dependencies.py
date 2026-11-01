from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

from auth.security import decode_access_token
from config.settings import settings

bearer_scheme = HTTPBearer(auto_error=False)

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Authentication required",
    headers={"WWW-Authenticate": "Bearer"},
)


def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:

    if not settings.auth_enabled:
        return {"sub": "anonymous", "type": "access"}

    if credentials is None or credentials.scheme.lower() != "bearer":
        raise _UNAUTHORIZED

    try:
        return decode_access_token(credentials.credentials)
    except jwt.PyJWTError:
        raise _UNAUTHORIZED
