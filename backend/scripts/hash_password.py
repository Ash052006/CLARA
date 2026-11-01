"""Generate an OWNER_PASSWORD_HASH value for Render.

Usage:

    python backend/scripts/hash_password.py

The password is read without echo and is never written to disk or logs.
"""

import getpass
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from auth.security import hash_password  # noqa: E402


def main() -> int:
    password = getpass.getpass("Owner password: ")
    confirmation = getpass.getpass("Confirm password: ")

    if password != confirmation:
        print("Passwords do not match.")
        return 1

    if len(password) < 12:
        print("Please use at least 12 characters.")
        return 1

    print(hash_password(password))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
