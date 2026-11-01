"""Structured JSON logging with secret redaction."""

import json
import logging
import os
import sys
from datetime import datetime, timezone

from config.settings import settings

_SENSITIVE_ENV_KEYS = (
    "GROQ_API_KEY",
    "DATABASE_URL",
    "PGPASSWORD",
    "GOOGLE_CREDENTIALS_JSON",
    "GMAIL_TOKEN_JSON",
    "GOOGLE_CALENDAR_TOKEN_JSON",
    "OWNER_PASSWORD_HASH",
    "JWT_SECRET",
)


def _secret_values():
    values = []
    for key in _SENSITIVE_ENV_KEYS:
        value = os.getenv(key)
        if value and len(value) >= 6:
            values.append(value)
    return values


class RedactionFilter(logging.Filter):
    def __init__(self) -> None:
        super().__init__()
        self._secrets = _secret_values()

    def filter(self, record: logging.LogRecord) -> bool:
        message = record.getMessage()
        for secret in self._secrets:
            if secret in message:
                message = message.replace(secret, "***REDACTED***")
        record.msg = message
        record.args = ()
        return True


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        for key in ("request_id", "path", "method", "status_code", "client_ip"):
            value = getattr(record, key, None)
            if value is not None:
                payload[key] = value
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, default=str)


def configure_logging() -> None:
    level = getattr(logging, settings.log_level, logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    handler.addFilter(RedactionFilter())

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level)

    # Route uvicorn through the same structured handler.
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logger = logging.getLogger(name)
        logger.handlers.clear()
        logger.propagate = True
