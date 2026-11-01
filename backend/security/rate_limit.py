"""Small in-process rate limiter for a single Render instance.

No Redis or extra infrastructure is required. Login attempts are limited more
strictly than normal authenticated API traffic.
"""

import threading
import time
from collections import deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from config.settings import settings


class SlidingWindowLimiter:
    def __init__(self, limit: int, window_seconds: int) -> None:
        self.limit = max(1, limit)
        self.window = max(1, window_seconds)
        self._hits = {}
        self._lock = threading.Lock()

    def check(self, key: str):
        now = time.monotonic()
        cutoff = now - self.window

        with self._lock:
            hits = self._hits.setdefault(key, deque())

            while hits and hits[0] <= cutoff:
                hits.popleft()

            if len(hits) >= self.limit:
                retry_after = max(1, int(hits[0] + self.window - now) + 1)
                return False, retry_after

            hits.append(now)

            if len(self._hits) > 10000:
                for stale_key in [
                    stale for stale, values in self._hits.items() if not values
                ]:
                    self._hits.pop(stale_key, None)

            return True, 0


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app) -> None:
        super().__init__(app)
        self.login_limiter = SlidingWindowLimiter(
            settings.login_rate_limit, settings.login_rate_window
        )
        self.api_limiter = SlidingWindowLimiter(
            settings.api_rate_limit, settings.api_rate_window
        )

    @staticmethod
    def _client_ip(request) -> str:
        if request.client and request.client.host:
            return request.client.host
        forwarded = request.headers.get("x-forwarded-for", "")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return "unknown"

    async def dispatch(self, request, call_next):
        path = request.url.path

        if path in {"/auth/login"}:
            limiter = self.login_limiter
            category = "login"
        elif (
            path.startswith("/chat")
            or path.startswith("/voice")
            or path.startswith("/auth/refresh")
            or path.startswith("/auth/logout")
        ):
            limiter = self.api_limiter
            category = "api"
        else:
            return await call_next(request)

        allowed, retry_after = limiter.check(
            f"{category}:{self._client_ip(request)}"
        )

        if not allowed:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please slow down."},
                headers={"Retry-After": str(retry_after)},
            )

        return await call_next(request)
