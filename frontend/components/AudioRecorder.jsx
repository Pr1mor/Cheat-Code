"use client";
import { useState, useRef } from "react";

export default function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleMicClick = async () => {
        // IF ALREADY RECORDING: Stop it
        if (isRecording) {
            stopRecording();
        }
        // IF NOT RECORDING: Start it
        else {
            await startRecording();
        }
    };

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
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                if (audioBlob.size > 0) {
                    const url = URL.createObjectURL(audioBlob);
                    setAudioUrl(url);
                }
                // Shut off the mic hardware
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            };
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">

            {/* Tap Button */}
            <button
                onClick={handleMicClick}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording
                    ? "bg-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                    : "bg-blue-600 hover:bg-blue-500 shadow-lg"
                    }`}
            >
                {isRecording ? (
                    // Stop Icon (Square)
                    <div className="w-6 h-6 bg-white rounded-sm" />
                ) : (
                    // Mic Icon (Simple Circle/SVG)
                    <span className="text-3xl">🎤</span>
                )}
            </button>

            <p className="text-sm font-medium text-gray-400">
                {isRecording ? "Tap to stop recording" : "Tap to start talking"}
            </p>

            {/* Playback Area */}
            {audioUrl && (
                <div className="mt-4 p-4 bg-gray-800 rounded-xl border border-gray-700 animate-in slide-in-from-bottom-2">
                    <audio src={audioUrl} controls className="h-10" />
                </div>
            )}
        </div>
    );
}