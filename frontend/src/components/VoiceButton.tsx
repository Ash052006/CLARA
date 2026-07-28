import { useState } from "react";
import { useVoice } from "../hooks/useVoice";
import { sendVoiceMessage } from "../services/voice";

export default function VoiceButton() {
    const {
        isRecording,
        startRecording,
        stopRecording,
    } = useVoice();

    const [loading, setLoading] = useState(false);

    const handleClick = async () => {

        if (!isRecording) {
            await startRecording();
            return;
        }

        setLoading(true);

        try {

            const audioBlob = await stopRecording();

            const result = await sendVoiceMessage(audioBlob);

            console.log("Transcript:", result.transcript);
            console.log("Assistant:", result.response);

        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <button onClick={handleClick}>
            {loading
                ? "Thinking..."
                : isRecording
                ? "Stop Recording"
                : "Start Recording"}
        </button>
    );
}