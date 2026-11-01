import { API_BASE_URL } from "./config";
import { authorizedFetch } from "./auth";

export { API_BASE_URL };

export async function sendToCLARA(message) {
  const response = await authorizedFetch(
    `/chat/${encodeURIComponent(message)}`,
    {},
    60000
  );

  if (!response.ok) {
    let detail = "";

    try {
      const body = await response.json();
      detail = body.detail || "";
    } catch {
      detail = "";
    }

    throw new Error(detail || `Backend request failed (${response.status})`);
  }

  return await response.json();
}
