"use client";
import { useState, useRef } from "react";
import styles from "./AudioRecorder.module.css";

export default function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const playAIResponse = (audioUrl) => {
        console.log("Attempting to play:", audioUrl);
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.error("Playback failed:", e));
    };
    const toggleMic = async () => {
        if (isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];
            recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
            recorder.onstop = async () => {
                const userInput = new Blob(chunksRef.current, { type: "audio/webm" });
                console.log("Recorded Audio Blob:", userInput);
                // Logic for Task 2 (sending to backend) will go here next
                const formData = new FormData();
                formData.append("audio", userInput, "interview.webm");
                try {
                    // Replace URL with Member 3's backend endpoint
                    const response = await fetch("http://localhost:8080/chats", {
                        method: "POST",
                        body: formData,
                    });
                    const data = await response.json();

                    // As soon as the backend sends the URL, it plays!
                    if (data.audio) {
                        const audioBlob = new Blob([
                            Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))
                        ], {type: "audio/mpeg"});
                        const audioUrl = URL.createObjectURL(audioBlob);
                        new Audio(audioUrl).play();
                    }
                } catch (err) {
                    console.log("Static Test: Backend not found, playing local file instead.");
                    playAIResponse("/testing.mp3");
                }
                stream.getTracks().forEach(t => t.stop());
            };

            recorder.start();
            setIsRecording(true);
        }
    };

    return (
        <div className={styles.container}>
            <button
                onClick={toggleMic}
                className={`${styles.btn} ${isRecording ? styles.recording : ""}`}
            >
                {isRecording ? <div className={styles.stopIcon} /> : "🎤"}
            </button>
        </div >
    );
}