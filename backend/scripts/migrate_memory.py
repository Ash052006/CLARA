"""Copy backend/storage/memory.json into the PostgreSQL memory_store table.

Usage (from the repository root or backend directory):

    DATABASE_URL=postgresql://... python backend/scripts/migrate_memory.py

The JSON file is read only and is never modified or deleted.
"""

import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from config.settings import settings  # noqa: E402
from memory import database  # noqa: E402


def main() -> int:
    if not settings.database_url:
        print("DATABASE_URL is not set; nothing to migrate.")
        return 1

    if not settings.memory_file.exists():
        print(f"No memory file found at {settings.memory_file}")
        return 0

    with open(settings.memory_file, "r", encoding="utf-8") as handle:
        data = json.load(handle)

    if not isinstance(data, dict):
        print("Memory file does not contain a JSON object; aborting.")
        return 1

    if not database.init_database():
        print("Could not initialize the database.")
        return 1

    existing = database.load_namespace("long_term")

    if existing:
        print(
            "PostgreSQL already contains long-term memory. "
            "Nothing was overwritten."
        )
        return 0

    database.replace_namespace("long_term", data)
    print(f"Migrated {len(data)} keys from {settings.memory_file} to PostgreSQL.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
