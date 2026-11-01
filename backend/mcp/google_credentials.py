import os


def materialize(path, env_name):

    if os.path.exists(path):
        return

    raw = os.getenv(env_name)

    if raw:
        with open(path, "w") as handle:
            handle.write(raw)


def ensure_interactive_oauth_allowed():

    allowed = os.getenv(
        "CLARA_ALLOW_INTERACTIVE_OAUTH", ""
    ).lower()

    if allowed not in ("1", "true", "yes"):
        raise RuntimeError(
            "Google OAuth is not configured for this deployment. "
            "Provide the token and credentials as environment variables "
            "or finish the OAuth flow locally before deploying."
        )
