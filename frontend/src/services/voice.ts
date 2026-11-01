const BASE_URL = import.meta.env.VITE_API_URL || "";

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

    const response = await fetch(
        `${BASE_URL}/voice/chat`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Voice request failed");
    }

    return response.json();
}