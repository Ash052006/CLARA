# CLARA Production Deployment Guide

Target architecture:

- **Backend:** FastAPI on Render Web Service
- **Frontend:** React + Vite on Netlify
- **Database:** PostgreSQL (single-user memory + refresh tokens)
- **AI:** Groq
- **Integrations:** Gmail, Google Calendar, in-process MCP
- **Desktop:** Tauri v2, sharing the same backend

> Single-owner deployment. This is not multi-tenant SaaS and does not implement
> per-user accounts. Never commit `.env` files or secrets.

---

## 1. Repository layout

```
CLARA/
├── backend/                    # FastAPI (entry point: backend/main.py)
│   ├── main.py                 # app, /health, protected /chat, auth + voice routers
│   ├── auth/                   # single-owner login, JWT, refresh tokens
│   ├── security/               # in-process rate limiting
│   ├── config/                 # settings + structured logging
│   ├── memory/                 # PostgreSQL storage + JSON fallback
│   ├── mcp/                    # in-process MCP servers + Google OAuth helper
│   ├── tools/executor.py       # MCP action allowlist + demo-mode restrictions
│   ├── requirements.txt
│   ├── .python-version
│   └── scripts/                # password hashing + memory migration
├── frontend/                   # Vite + React + Tauri
│   ├── src/services/auth.js    # token lifecycle + login
│   ├── src/components/AuthGate.jsx
│   ├── src/components/LoginScreen.jsx
│   ├── src/services/config.js  # VITE_API_URL + Tauri override
│   └── src-tauri/              # unchanged desktop app
├── netlify.toml
├── render.yaml
└── DEPLOYMENT.md
```

---

## 2. Authentication

Single-owner authentication using:

- **bcrypt** password hashing (`OWNER_PASSWORD_HASH`)
- **JWT access tokens** (15 minutes by default)
- **Opaque refresh tokens** (7 days by default), stored **hashed** in PostgreSQL
- **Refresh-token rotation** on every refresh
- **Login rate limiting** (5 attempts / 15 minutes by default)

Protected routes: `GET /chat/{message}`, `POST /voice/chat`, `GET /auth/me`,
`POST /auth/logout-all`.

Public routes: `GET /`, `GET /health`, `GET /auth/config`, `POST /auth/login`,
`POST /auth/refresh`, `POST /auth/logout`.

### Generate the password hash

```bash
python backend/scripts/hash_password.py
```

Copy the printed bcrypt hash into the Render secret `OWNER_PASSWORD_HASH`.
Never store the plaintext password in the repository or frontend.

### Generate the JWT secret

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Set it as `JWT_SECRET` on Render. If omitted, an ephemeral secret is generated,
which invalidates all access tokens on every restart.

### Frontend behaviour

- Access tokens are held in memory only.
- Refresh tokens are stored in `localStorage` and rotated on use. If you prefer
  OS-level storage in the Tauri app, replace the `localStorage` calls in
  `frontend/src/services/auth.js` with a Tauri keychain plugin.
- A failed/expired session returns the user to the login screen.
- `/auth/config` tells the frontend whether auth is enabled, whether demo mode
  is active, and whether voice is available. It contains no secrets.

---

## 3. Demo mode

Set `DEMO_MODE=true` for interviews/showcases:

| Operation | Demo mode |
|---|---|
| Read inbox (`read_emails`) | ✅ allowed |
| Search emails (`search_emails`) | ✅ allowed |
| List calendar events (`list_events`) | ✅ allowed |
| Send email | ⛔ blocked |
| Reply to email | ⛔ blocked |
| Create meeting / holiday | ⛔ blocked |
| Update event | ⛔ blocked |
| Delete event | ⛔ blocked |
| Unknown actions | ⛔ blocked |

Blocked actions return `{"status":"blocked", ...}`, are logged, and never reach
Google APIs. Set `DEMO_MODE=false` for owner operations; all existing tools then
work as before (subject to authentication).

`render.yaml` sets `DEMO_MODE=true` by default for the portfolio deployment.

---

## 4. Environment variables

### 4.1 Render (backend)

Required:

| Variable | Notes |
|---|---|
| `PORT` | Provided automatically by Render |
| `ENVIRONMENT` | `production` |
| `CORS_ORIGINS` | `https://your-site.netlify.app` (comma-separated) |
| `GROQ_API_KEY` | Groq key (secret) |
| `DATABASE_URL` | Render PostgreSQL connection string |
| `MEMORY_BACKEND` | `database` |
| `AUTH_ENABLED` | `true` |
| `OWNER_PASSWORD_HASH` | bcrypt hash (secret) |
| `JWT_SECRET` | Long random value (secret) |

Authentication / demo:

| Variable | Default |
|---|---|
| `AUTH_ACCESS_TOKEN_MINUTES` | `15` |
| `AUTH_REFRESH_TOKEN_DAYS` | `7` |
| `DEMO_MODE` | `false` (Render blueprint sets `true`) |
| `LOGIN_RATE_LIMIT` | `5` |
| `LOGIN_RATE_WINDOW_SECONDS` | `900` |
| `RATE_LIMIT_REQUESTS` | `60` |
| `RATE_LIMIT_WINDOW_SECONDS` | `60` |

AI / resources (free-tier defaults):

| Variable | Default |
|---|---|
| `VOICE_ENABLED` | `false` |
| `INTENT_CLASSIFIER_ENABLED` | `false` |
| `CLARA_WARMUP` | `false` |
| `GROQ_MODEL` | `openai/gpt-oss-120b` |
| `WHISPER_MODEL` / `WHISPER_DEVICE` / `WHISPER_COMPUTE_TYPE` | `base` / `cpu` / `int8` |

Google OAuth:

| Variable | Notes |
|---|---|
| `GOOGLE_CREDENTIALS_JSON` | OAuth client JSON (secret) |
| `GMAIL_TOKEN_JSON` | Gmail token JSON (secret) |
| `GOOGLE_CALENDAR_TOKEN_JSON` | Calendar token JSON (secret) |
| `GOOGLE_OAUTH_INTERACTIVE` | `false` on Render |

### 4.2 Netlify (frontend)

| Variable | Notes |
|---|---|
| `VITE_API_URL` | `https://your-backend.onrender.com` (public) |

Never put secrets in `VITE_*` variables; they are embedded in the browser bundle.

### 4.3 Tauri

```bash
cd frontend
VITE_API_URL=https://your-backend.onrender.com npm run tauri build
```

Omit `VITE_API_URL` for local desktop development (falls back to
`http://127.0.0.1:8001`). A runtime override is also supported:

```js
window.__CLARA_API_URL__ = "https://your-backend.onrender.com";
```

The login screen and token refresh work inside Tauri unchanged.

---

## 5. Render backend setup

1. Connect the repository in Render.
2. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** Python
   - **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips='*'`
   - **Health Check Path:** `/health`
3. Add the environment variables above.
4. Deploy.

Or commit `render.yaml` and use **New → Blueprint**. The blueprint uses the
free plan, disables Whisper/Transformers by default, and sets `DEMO_MODE=true`.

### Exact commands

```bash
# build
pip install --upgrade pip && pip install -r requirements.txt

# start
uvicorn main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips='*'
```

The existing entry point (`backend/main.py`, `app = FastAPI()`) is preserved.
`python main.py` also binds to `0.0.0.0:$PORT`.

### Free-tier notes

- Groq does the reasoning remotely, so no local LLM is required.
- Whisper and the Transformers classifier are disabled by default.
- Heavy models stay lazy and are never loaded at import time.
- Render free instances sleep; the frontend shows a retry-friendly error and
  refreshes the session on wake.

---

## 6. Netlify frontend setup

Netlify reads the root `netlify.toml`:

- **Base directory:** `frontend`
- **Build command:** `npm ci && npm run build`
- **Publish directory:** `dist`
- **SPA redirect:** `/* → /index.html 200`

Add `VITE_API_URL` in **Site configuration → Environment variables**, then
deploy. `frontend/public/_redirects` provides the same SPA fallback.

---

## 7. PostgreSQL setup

1. Create Render PostgreSQL (or let `render.yaml` create `clara-db`).
2. Set `DATABASE_URL` to the internal connection URL.
3. Set `MEMORY_BACKEND=database`.
4. Deploy. The `memory_store` table is created automatically.

### Migrating existing JSON memory

The backend copies `backend/storage/memory.json` into PostgreSQL on first start
when the `long_term` namespace is empty. It never deletes the JSON file and
creates a one-time `.bak` before writing JSON.

Manual migration:

```bash
DATABASE_URL=postgresql://user:password@host:5432/clara \
  python backend/scripts/migrate_memory.py
```

### What is persisted

| Data | Storage |
|---|---|
| Long-term preferences | `memory_store` namespace `long_term` |
| Short-term context / last calendar event | namespace `short_term` |
| Refresh tokens (hashed) | namespace `auth_refresh` |
| Conversation transcript | Not stored; only derived context |
| Task state | Derived per request |

Memory is only accessible through authenticated `POST /chat` / `GET /chat`
requests; there is no public memory endpoint.

---

## 8. Google OAuth production configuration

1. Enable Gmail API and Google Calendar API.
2. Scopes used by CLARA:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/calendar`
3. Generate authorized-user token JSON locally, then store the contents as
   `GMAIL_TOKEN_JSON` and `GOOGLE_CALENDAR_TOKEN_JSON` on Render.
4. Store the OAuth client JSON as `GOOGLE_CREDENTIALS_JSON`.
5. Set `GOOGLE_OAUTH_INTERACTIVE=false`.

Interactive `run_local_server()` login cannot work on Render; pre-authorized
token JSON is required. Tokens are refreshed automatically when a refresh token
is present. Token values are never returned by any API route or exposed to the
frontend.

---

## 9. MCP and safety

- MCP servers are in-process; no subprocess transport is required.
- `ToolExecutor` enforces an action allowlist.
- Demo mode restricts tools to read-only operations before any Google API call.
- Unknown actions are rejected.
- Tool exceptions are logged and returned as generic errors.

---

## 10. Security summary

- bcrypt password hashing.
- Short-lived JWT access tokens; hashed, rotating refresh tokens.
- Login and API rate limiting (in-process).
- Strict CORS from `CORS_ORIGINS`; wildcard removed in production.
- API docs (`/docs`, `/redoc`, `/openapi.json`) disabled in production.
- Structured JSON logs with secret redaction.
- Debug details hidden in production error responses.
- Google credentials and refresh tokens are backend-only.
- Demo mode blocks destructive MCP actions.

---

## 11. Tests executed

Actual results from this repository are reported in the accompanying delivery
report. The commands used:

```bash
# Backend import + route list
cd backend
DATABASE_URL= python -c "import main; print(sorted(r.path for r in main.app.routes if hasattr(r,'path')))"

# Backend startup, auth, chat, CORS, demo mode, refresh rotation
uvicorn main:app --host 127.0.0.1 --port 8130
# then run the HTTP test script used for the delivery report

# Rate limiting
uvicorn main:app --host 127.0.0.1 --port 8131   # low LIMIT env values

# Memory persistence across restart
# start server → chat → stop → start again → read memory

# Frontend build
cd frontend
VITE_API_URL=https://your-backend.onrender.com npm run build

# Tauri compatibility
cargo check --manifest-path frontend/src-tauri/Cargo.toml
```

---

## 12. Deployment checklist

1. [ ] Generate `OWNER_PASSWORD_HASH` and `JWT_SECRET`.
2. [ ] Create Render PostgreSQL.
3. [ ] Deploy Render with `AUTH_ENABLED=true` and strict `CORS_ORIGINS`.
4. [ ] Verify `/health` returns `200`.
5. [ ] Verify unauthenticated `/chat/hello` returns `401`.
6. [ ] Verify login works and `/chat/hello` works with the access token.
7. [ ] Add Google token JSON secrets (if using integrations).
8. [ ] Deploy Netlify with `VITE_API_URL`.
9. [ ] Confirm the login screen appears on Netlify.
10. [ ] Confirm `/about` refresh works.
11. [ ] Confirm demo mode blocks send/delete/update actions.
12. [ ] Confirm memory and refresh tokens survive a Render restart.
13. [ ] Confirm Tauri desktop login and chat work against Render.

---

## 13. Remaining manual steps

1. Choose `DEMO_MODE=true` for demos or `false` for owner operations.
2. Set `OWNER_PASSWORD_HASH` and `JWT_SECRET` on Render.
3. Set `CORS_ORIGINS` to the exact Netlify/custom-domain origin.
4. Provide Google token JSON if Gmail/Calendar should work.
5. Verify login, chat, demo restrictions, and persistence after a redeploy.
6. Optionally enable `VOICE_ENABLED=true` / `INTENT_CLASSIFIER_ENABLED=true` on a
   larger Render plan.

---

## 14. Known limitations and risks

- **Single owner only.** There is no multi-user isolation; memory is global to
  the owner.
- **Refresh token storage:** the web/desktop client stores the refresh token in
  `localStorage`. Server-side stores only its hash and rotates it. For stronger
  desktop hardening, use a Tauri keychain plugin.
- **Rate limiting is in-process.** It resets on restart and is not shared across
  multiple Render instances. This is appropriate for a single free-tier instance.
- **Free-tier sleeping:** the first request after sleep may take several seconds.
- **Model memory:** `torch`/`transformers`/Whisper are disabled by default; enable
  them only on a larger plan.
- **Google OAuth:** Render requires pre-authorized token JSON; interactive login
  is desktop-only.
- **Tauri CSP** remains `null`; tighten it if you need stricter desktop hardening.
- **`backend/node_modules` is tracked** in git (pre-existing). Consider removing
  it from the index in a separate cleanup change.
- The legacy edited files use CRLF; `git diff --check` may report CR-at-EOL
  warnings for added lines.
