const API_URL = "http://localhost:8000";

export async function sendToCLARA(message) {
  const response = await fetch(
    `${API_URL}/chat/${encodeURIComponent(message)}`
  );

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return await response.json();
}