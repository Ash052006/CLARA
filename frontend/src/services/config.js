const envUrl = import.meta.env.VITE_API_URL;

const isTauri =
  typeof window !== "undefined" &&
  (window.__TAURI_INTERNALS__ !== undefined ||
    window.__TAURI__ !== undefined);

const runtimeOverride =
  typeof window !== "undefined" ? window.__CLARA_API_URL__ : undefined;

const fallbackUrl = isTauri
  ? "http://127.0.0.1:8001"
  : "http://localhost:8001";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const IS_TAURI = isTauri;

export const API_BASE_URL = trimTrailingSlash(
  runtimeOverride || envUrl || fallbackUrl
);

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiFetch(path, options = {}, timeoutMs = 45000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(buildApiUrl(path), {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "CLARA backend timed out. If the service was sleeping, it may take up to 45 seconds to wake up — please retry."
      );
    }
    throw new Error(
      "Unable to reach the CLARA backend. It may be waking up — please retry in a moment."
    );
  } finally {
    clearTimeout(timer);
  }
}
