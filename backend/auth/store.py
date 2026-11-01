"""Refresh-token storage.

Tokens are stored hashed, never in plaintext. PostgreSQL is used when
configured; otherwise an in-process store keeps local development working.
"""

import logging
import threading
from datetime import datetime, timezone

from config.settings import settings

logger = logging.getLogger(__name__)

NAMESPACE = "auth_refresh"

_local_store = {}
_local_lock = threading.Lock()


def _database():
    if not settings.memory_uses_database:
        return None
    try:
        from memory import database

        if database.init_database():
            return database
    except Exception:
        logger.exception("refresh-token database unavailable")
    return None


def _parse_expiry(value):
    if isinstance(value, datetime):
        expires = value
    elif isinstance(value, str):
        try:
            expires = datetime.fromisoformat(value)
        except ValueError:
            return None
    elif isinstance(value, dict):
        return _parse_expiry(value.get("expires_at"))
    else:
        return None

    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    return expires


def save_refresh(token_hash: str, expires_at: datetime) -> None:
    database = _database()

    if database is not None:
        database.upsert_value(
            NAMESPACE, token_hash, {"expires_at": expires_at.isoformat()}
        )
        return

    with _local_lock:
        _local_store[token_hash] = expires_at


def consume_refresh(token_hash: str) -> bool:
    """Validate and one-time-use a refresh token."""

    now = datetime.now(timezone.utc)
    database = _database()

    if database is not None:
        value = database.get_value(NAMESPACE, token_hash)
        database.delete_value(NAMESPACE, token_hash)
        expires = _parse_expiry(value)
        return bool(expires and expires > now)

    with _local_lock:
        expires = _local_store.pop(token_hash, None)

    return bool(expires and expires > now)


def revoke_refresh(token_hash: str) -> None:
    database = _database()

    if database is not None:
        database.delete_value(NAMESPACE, token_hash)
        return

    with _local_lock:
        _local_store.pop(token_hash, None)


def revoke_all() -> None:
    database = _database()

    if database is not None:
        database.clear_namespace(NAMESPACE)

    with _local_lock:
        _local_store.clear()
