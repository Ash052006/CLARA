import { API_BASE_URL } from "./config";
import { authorizedFetch } from "./auth";

export { API_BASE_URL };

export interface VoiceResponse {
    success: boolean;
    transcript: string;
    response: any;
}

export async function sendVoiceMessage(
    audioBlob: Blob,
    filename = "recording.webm"
): Promise<VoiceResponse> {

    const formData = new FormData();

    formData.append(
        "audio",
        audioBlob,
        filename
    );

    const response = await authorizedFetch(
        "/voice/chat",
        {
            method: "POST",
            body: formData,
        },
        180000
    );

    if (!response.ok) {
        let detail = "";

        try {
            const body = await response.json();
            detail = body.detail || "";
        } catch {
            detail = "";
        }

        throw new Error(detail || `Voice request failed (${response.status})`);
    }

    return response.json();
}
