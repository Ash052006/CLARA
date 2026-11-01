import json
import logging
import os
from pathlib import Path

from config.settings import settings

logger = logging.getLogger(__name__)


class LongTermMemory:
    """Persist user preferences.

    When ``DATABASE_URL`` is configured the data lives in PostgreSQL. Otherwise
    the original JSON file behaviour is preserved. Existing JSON data is copied
    into PostgreSQL on first use and is never deleted by this class.
    """

    def __init__(self, file=None):

        self.file = Path(file) if file else settings.memory_file

        self._database = None

        if settings.memory_uses_database:
            try:
                from memory import database

                if database.init_database():
                    self._database = database
                elif settings.is_production and settings.memory_backend == "database":
                    logger.critical(
                        "CRITICAL: PostgreSQL database could not be initialized in production. "
                        "Memory will not persist reliably across restarts."
                    )
            except Exception:
                logger.exception(
                    "PostgreSQL unavailable, falling back to JSON memory file"
                )

        if self._database is not None:
            self._migrate_existing_file()

    # ------------------------------------------------------------------
    # JSON fallback
    # ------------------------------------------------------------------

    def _read_file(self):

        try:
            with open(self.file, "r", encoding="utf-8") as handle:
                return json.load(handle)
        except FileNotFoundError:
            return {}
        except (json.JSONDecodeError, OSError):
            logger.exception("could not read memory file %s", self.file)
            return {}

    def _write_file(self, data):

        self.file.parent.mkdir(parents=True, exist_ok=True)

        if self.file.exists():
            backup = self.file.with_suffix(self.file.suffix + ".bak")
            if not backup.exists():
                backup.write_bytes(self.file.read_bytes())

        temporary = self.file.with_suffix(self.file.suffix + ".tmp")
        with open(temporary, "w", encoding="utf-8") as handle:
            json.dump(data, handle, indent=4)
        os.replace(temporary, self.file)

    # ------------------------------------------------------------------
    # Python -> PostgreSQL migration
    # ------------------------------------------------------------------

    def _migrate_existing_file(self):

        if not self.file.exists():
            return

        existing = self._database.load_namespace("long_term")

        if existing:
            return

        data = self._read_file()

        if not data:
            return

        self._database.replace_namespace("long_term", data)
        logger.info(
            "migrated %d long-term memory keys from %s to PostgreSQL",
            len(data),
            self.file,
        )

    # ------------------------------------------------------------------
    # Public API (unchanged)
    # ------------------------------------------------------------------

    def save(self, data):

        if self._database is not None:
            self._database.replace_namespace("long_term", data)
            return

        if settings.is_production and settings.memory_backend == "database":
            raise RuntimeError(
                "PostgreSQL memory backend is required in production, but database is unavailable. "
                "Refusing to write to ephemeral local file."
            )

        self._write_file(data)

    def load(self):

        if self._database is not None:
            return self._database.load_namespace("long_term")

        if settings.is_production and settings.memory_backend == "database":
            raise RuntimeError(
                "PostgreSQL memory backend is required in production, but database is unavailable. "
                "Refusing to read from ephemeral local file."
            )

        return self._read_file()
