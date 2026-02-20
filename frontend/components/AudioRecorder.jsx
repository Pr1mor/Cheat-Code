"use client";
import { useState, useRef } from "react";

export default function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setAudioUrl(null);
        } catch (error) {
            console.error("Mic error:", error);
            alert("Please allow microphone access!");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url); // This makes the audio player appear on your website
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            };
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-gray-900 rounded-lg mt-10">

            {/* Notice: Only Mouse events now! */}
            <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                className={`px-8 py-4 rounded-full text-white font-bold transition-all ${isRecording ? "bg-red-500 scale-110" : "bg-blue-600 hover:bg-blue-500"
                    }`}
            >
                {isRecording ? "Listening..." : "Hold to Talk"}
            </button>

            {/* The Audio Player */}
            {audioUrl && (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-green-400 font-mono">Success! Play it back:</p>
                    <audio src={audioUrl} controls className="outline-none rounded-full" />
                </div>
            )}
        </div>
    );
}