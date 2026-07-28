import { useRef, useState } from "react";

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      console.log("========== VOICE DEBUG ==========");
      console.log("navigator =", navigator);
      console.log("navigator.mediaDevices =", navigator.mediaDevices);
      console.log("window.isSecureContext =", window.isSecureContext);
      console.log("MediaRecorder =", window.MediaRecorder);

      if (!navigator.mediaDevices) {
        throw new Error("navigator.mediaDevices is NOT available");
      }

      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia is NOT available");
      }

      console.log("Requesting microphone permission...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      console.log("Microphone permission granted!");

      const recorder = new MediaRecorder(stream);

      chunks.current = [];

      recorder.onstart = () => {
        console.log("Recording started");
      };

      recorder.ondataavailable = (event) => {
        console.log("Chunk received:", event.data.size);

        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        console.log("Recording stopped");
      };

      recorder.onerror = (event) => {
        console.error("MediaRecorder Error:", event);
      };

      mediaRecorder.current = recorder;

      recorder.start();

      setIsRecording(true);
    } catch (err) {
      console.error("VOICE ERROR:", err);
    }
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder.current) {
        reject(new Error("Recorder not initialized"));
        return;
      }

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, {
          type: "audio/webm",
        });

        console.log("Blob created:", blob);

        setIsRecording(false);

        resolve(blob);
      };

      mediaRecorder.current.stop();
    });
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}