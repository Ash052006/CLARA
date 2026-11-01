"""Shared Google OAuth credential handling for Gmail and Calendar."""

import json
import logging
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

from config.settings import settings

logger = logging.getLogger(__name__)


def _load_token(token_path: Path, token_json: str, scopes):
    if token_json:
        try:
            return Credentials.from_authorized_user_info(
                json.loads(token_json), scopes
            )
        except (ValueError, TypeError):
            logger.exception("GOOGLE token environment variable is not valid JSON")

    if token_path.exists():
        try:
            return Credentials.from_authorized_user_file(str(token_path), scopes)
        except (ValueError, OSError):
            logger.exception("could not read token file %s", token_path)

    return None


def _load_client_config(credentials_path: Path, credentials_json: str):
    if credentials_json:
        try:
            return json.loads(credentials_json)
        except (ValueError, TypeError):
            logger.exception(
                "GOOGLE_CREDENTIALS_JSON environment variable is not valid JSON"
            )
            return None

    if credentials_path.exists():
        with open(credentials_path, "r", encoding="utf-8") as handle:
            return json.load(handle)

    return None


def _persist_token(creds, token_path: Path, token_json: str) -> None:
    """Write refreshed tokens when using a file, never mutate an env var."""

    if token_json:
        return

    try:
        token_path.parent.mkdir(parents=True, exist_ok=True)
        with open(token_path, "w", encoding="utf-8") as handle:
            handle.write(creds.to_json())
    except OSError:
        logger.exception("could not persist refreshed Google token")


def get_credentials(
    scopes,
    token_path: Path,
    token_json: str,
    credentials_path: Path,
    credentials_json: str,
):
    creds = _load_token(token_path, token_json, scopes)

    if creds and creds.valid:
        return creds

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        _persist_token(creds, token_path, token_json)
        return creds

    client_config = _load_client_config(credentials_path, credentials_json)

    if client_config is None:
        raise RuntimeError(
            "Google OAuth client credentials are not configured. Set "
            "GOOGLE_CREDENTIALS_JSON or GOOGLE_CREDENTIALS_FILE."
        )

    if not settings.google_oauth_interactive:
        raise RuntimeError(
            "Google OAuth token is missing or expired and interactive login is "
            "disabled. Set GMAIL_TOKEN_JSON / GOOGLE_CALENDAR_TOKEN_JSON (or the "
            "corresponding token file) with a valid refresh token."
        )

    flow = InstalledAppFlow.from_client_config(client_config, scopes)
    creds = flow.run_local_server(port=0)
    _persist_token(creds, token_path, token_json)
    return creds
