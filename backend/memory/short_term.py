import logging

from config.settings import settings

logger = logging.getLogger(__name__)


class ShortTermMemory:
    """Conversation context for the current session.

    The original in-memory behaviour is retained. When PostgreSQL is
    configured the context is additionally persisted so it survives restarts
    and Render redeploys.
    """

    def __init__(self):

        self.context = {}

        self._database = None

        if settings.memory_uses_database:
            try:
                from memory import database

                if database.init_database():
                    self._database = database
            except Exception:
                logger.exception(
                    "PostgreSQL unavailable, keeping short-term memory in process"
                )

        if self._database is not None:
            try:
                self.context = self._database.load_namespace("short_term")
            except Exception:
                logger.exception("could not load short-term memory from PostgreSQL")

    def save(self, key, value):

        self.context[key] = value

        if self._database is not None:
            try:
                self._database.upsert_value("short_term", key, value)
            except Exception:
                logger.exception("could not save short-term memory key %s", key)
                if settings.is_production and settings.memory_backend == "database":
                    raise
        elif settings.is_production and settings.memory_backend == "database":
            raise RuntimeError(
                f"PostgreSQL memory backend is required in production, but database is unavailable. "
                f"Cannot persist short-term key '{key}'."
            )

    def get(self, key):

        return self.context.get(key)

    def get_all(self):

        return self.context

    def clear(self):

        self.context = {}

        if self._database is not None:
            try:
                self._database.clear_namespace("short_term")
            except Exception:
                logger.exception("could not clear short-term memory in PostgreSQL")
