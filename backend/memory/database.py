"""PostgreSQL-backed key/value storage for CLARA memory.

The module is intentionally optional: if SQLAlchemy is unavailable or
``DATABASE_URL`` is not configured, callers fall back to the JSON file store.
No existing data files are deleted by this module.
"""

import logging
import threading
from datetime import datetime, timezone

from config.settings import settings

logger = logging.getLogger(__name__)

_engine = None
_metadata = None
_table = None
_lock = threading.Lock()


def _sqlalchemy():
    try:
        import sqlalchemy as sa

        return sa
    except ImportError:  # pragma: no cover - optional dependency
        return None


def is_configured() -> bool:
    return bool(settings.database_url) and _sqlalchemy() is not None


def get_engine():
    global _engine
    if _engine is not None:
        return _engine
    if not is_configured():
        return None
    with _lock:
        if _engine is not None:
            return _engine
        sa = _sqlalchemy()
        kwargs = {"pool_pre_ping": True, "future": True}
        if settings.database_url.startswith("sqlite"):
            kwargs["connect_args"] = {"check_same_thread": False}
        else:
            kwargs.update(
                {
                    "pool_size": settings.db_pool_size,
                    "max_overflow": settings.db_max_overflow,
                    "pool_recycle": settings.db_pool_recycle,
                }
            )
        _engine = sa.create_engine(settings.database_url, **kwargs)
        return _engine


def init_database() -> bool:
    global _metadata, _table
    engine = get_engine()
    if engine is None:
        return False
    sa = _sqlalchemy()
    if _metadata is None:
        with _lock:
            if _metadata is None:
                _metadata = sa.MetaData()
                _table = sa.Table(
                    "memory_store",
                    _metadata,
                    sa.Column("namespace", sa.String(64), primary_key=True),
                    sa.Column("key", sa.String(255), primary_key=True),
                    sa.Column("value", sa.JSON, nullable=False),
                    sa.Column(
                        "updated_at",
                        sa.DateTime(timezone=True),
                        nullable=False,
                    ),
                )
    _metadata.create_all(engine)
    logger.info("database schema ready")
    return True


def _table_ref():
    if _table is None:
        init_database()
    return _table


def check_database() -> bool:
    engine = get_engine()
    if engine is None:
        return False
    try:
        sa = _sqlalchemy()
        with engine.connect() as connection:
            connection.execute(sa.text("SELECT 1"))
        return True
    except Exception:
        logger.exception("database health check failed")
        return False


def load_namespace(namespace: str) -> dict:
    engine = get_engine()
    table = _table_ref()
    if engine is None or table is None:
        return {}
    sa = _sqlalchemy()
    with engine.connect() as connection:
        rows = connection.execute(
            sa.select(table.c.key, table.c.value).where(
                table.c.namespace == namespace
            )
        ).fetchall()
    return {row.key: row.value for row in rows}


def get_value(namespace: str, key: str):
    engine = get_engine()
    table = _table_ref()
    if engine is None or table is None:
        return None
    sa = _sqlalchemy()
    with engine.connect() as connection:
        row = connection.execute(
            sa.select(table.c.value).where(
                table.c.namespace == namespace, table.c.key == key
            )
        ).first()
    return row.value if row else None


def delete_value(namespace: str, key: str) -> None:
    engine = get_engine()
    table = _table_ref()
    if engine is None or table is None:
        return
    sa = _sqlalchemy()
    with engine.begin() as connection:
        connection.execute(
            sa.delete(table).where(
                table.c.namespace == namespace, table.c.key == key
            )
        )


def upsert_value(namespace: str, key: str, value) -> None:
    engine = get_engine()
    table = _table_ref()
    if engine is None or table is None:
        return
    sa = _sqlalchemy()
    now = datetime.now(timezone.utc)
    with engine.begin() as connection:
        exists = connection.execute(
            sa.select(table.c.key).where(
                table.c.namespace == namespace, table.c.key == key
            )
        ).first()
        if exists:
            connection.execute(
                sa.update(table)
                .where(table.c.namespace == namespace, table.c.key == key)
                .values(value=value, updated_at=now)
            )
        else:
            connection.execute(
                sa.insert(table).values(
                    namespace=namespace,
                    key=key,
                    value=value,
                    updated_at=now,
                )
            )


def replace_namespace(namespace: str, data: dict) -> None:
    engine = get_engine()
    table = _table_ref()
    if engine is None or table is None:
        return
    sa = _sqlalchemy()
    now = datetime.now(timezone.utc)
    with engine.begin() as connection:
        connection.execute(
            sa.delete(table).where(table.c.namespace == namespace)
        )
        if data:
            connection.execute(
                sa.insert(table),
                [
                    {
                        "namespace": namespace,
                        "key": str(key),
                        "value": value,
                        "updated_at": now,
                    }
                    for key, value in data.items()
                ],
            )


def clear_namespace(namespace: str) -> None:
    engine = get_engine()
    table = _table_ref()
    if engine is None or table is None:
        return
    sa = _sqlalchemy()
    with engine.begin() as connection:
        connection.execute(
            sa.delete(table).where(table.c.namespace == namespace)
        )


def close_database() -> None:
    global _engine
    if _engine is not None:
        _engine.dispose()
        _engine = None
        logger.info("database connections closed")
