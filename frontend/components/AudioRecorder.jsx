"use client";
import { useState, useRef } from "react";
import styles from "./AudioRecorder.module.css";

export default function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

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
                formData.append("audio", blob, "interview.webm");

                try {
                    // Replace URL with Member 3's backend endpoint
                    await fetch("http://localhost:3001/api/interview", {
                        method: "POST",
                        body: formData,
                    });
                    console.log("Task 2 Success: Audio sent to backend!");
                } catch (err) {
                    console.error("Task 2 Failed: Backend unreachable", err);
                }
                stream.getTracks().forEach(t => t.stop());
            };

            recorder.start();
            setIsRecording(true);
        }
    };

    return (
        <button
            onClick={toggleMic}
            className={`${styles.btn} ${isRecording ? styles.recording : ""}`}
        >
            {isRecording ? <div className={styles.stopIcon} /> : "🎤"}
        </button>
    );
}