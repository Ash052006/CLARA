import { apiFetch } from "./config";

const REFRESH_TOKEN_KEY = "clara_refresh_token";

let accessToken = null;
let refreshPromise = null;
let authEnabled = true;
let listeners = new Set();

export function subscribeAuth(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(event) {
  listeners.forEach((listener) => listener(event));
}

export function setAuthEnabled(value) {
  authEnabled = Boolean(value);
}

export function isAuthEnabled() {
  return authEnabled;
}

export function getAccessToken() {
  return accessToken;
}

function setTokens(data) {
  accessToken = data?.access_token || null;

  if (data?.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }
}

function clearTokens() {
  accessToken = null;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function postJSON(path, body) {
  const response = await apiFetch(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    30000
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.detail || `Request failed (${response.status})`);
  }

  return data;
}

export async function getAuthConfig() {
  const response = await apiFetch("/auth/config", {}, 60000);

  if (!response.ok) {
    throw new Error(`Unable to load authentication configuration (${response.status})`);
  }

  return response.json();
}

export async function login(password) {
  const data = await postJSON("/auth/login", { password });
  setTokens(data);
  emit("authenticated");
  return data;
}

export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  refreshPromise = (async () => {
    try {
      const data = await postJSON("/auth/refresh", {
        refresh_token: refreshToken,
      });
      setTokens(data);
      return data;
    } catch (error) {
      clearTokens();
      emit("unauthenticated");
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function logout() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (refreshToken) {
    try {
      await postJSON("/auth/logout", { refresh_token: refreshToken });
    } catch {
      // Local logout still proceeds if the backend is unreachable.
    }
  }

  clearTokens();
  emit("unauthenticated");
}

export async function bootstrapAuth() {
  const config = await getAuthConfig();
  setAuthEnabled(config.auth_enabled);

  if (!config.auth_enabled) {
    return { status: "disabled", config };
  }

  if (localStorage.getItem(REFRESH_TOKEN_KEY)) {
    try {
      await refreshAccessToken();
      return { status: "authenticated", config };
    } catch {
      // Fall through to the login screen.
    }
  }

  return { status: "unauthenticated", config };
}

export async function authorizedFetch(path, options = {}, timeoutMs = 30000) {
  let token = accessToken;

  if (
    !token &&
    authEnabled &&
    localStorage.getItem(REFRESH_TOKEN_KEY)
  ) {
    try {
      token = (await refreshAccessToken()).access_token;
    } catch {
      token = null;
    }
  }

  const requestOptions = (currentToken) => ({
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(currentToken
        ? { Authorization: `Bearer ${currentToken}` }
        : {}),
    },
  });

  let response = await apiFetch(path, requestOptions(token), timeoutMs);

  if (
    response.status === 401 &&
    authEnabled &&
    localStorage.getItem(REFRESH_TOKEN_KEY)
  ) {
    try {
      const refreshed = await refreshAccessToken();
      response = await apiFetch(
        path,
        requestOptions(refreshed.access_token),
        timeoutMs
      );
    } catch {
      // refreshAccessToken already cleared tokens and emitted the event.
    }
  }

  return response;
}
