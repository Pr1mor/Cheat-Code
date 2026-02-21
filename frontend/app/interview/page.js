"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AudioRecorder from "../../components/AudioRecorder";
import styles from "./Interview.module.css";

export default function InterviewPage() {
    const difficultyColor = {
        easy: "#00b8a3",
        medium: "#ef7306",
        hard: "#f4220b",
    };
    const searchParams = useSearchParams();
    const difficulty = searchParams.get("difficulty") || "medium";
    const [code, setCode] = useState("// Type your solution here...");
    const [question, setQuestion] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ difficulty })
        })
            .then(res => res.json())
            .then(data => setQuestion(data.question));
    }, []);

    const submitCode = async () => {
        const response = await fetch("http://localhost:8080/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });
        const data = await response.json();

        // Show feedback in conversation panel
        setMessages(prev => [
            ...prev,
            { role: "user", text: "📝 Submitted code for review" },
            { role: "ai", text: data.response }
        ]);

        // Speak the feedback
        if (data.audio) {
            const audioBlob = new Blob([
                Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))
            ], { type: "audio/mpeg" });
            const audioUrl = URL.createObjectURL(audioBlob);
            new Audio(audioUrl).play();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newCode = code.substring(0, start) + "    " + code.substring(end);
            setCode(newCode);
            requestAnimationFrame(() => {
                textarea.selectionStart = start + 4;
                textarea.selectionEnd = start + 4;
            });
        }
    };

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>Cheat<span>Code</span></div>
                <div
                    className={styles.difficultyBadge}
                    style={{
                        backgroundColor: difficultyColor[difficulty.toLowerCase()] || "#238636"
                    }}
                >
                    {difficulty.toUpperCase()} MODE
                </div>
                {/* Submit button in header */}
                <button onClick={submitCode} className={styles.submitBtn}>
                    Submit Solution

                </button>
            </header>
            <div className={styles.workspace}>
                <section className={styles.editorContainer}>
                    {question && messages.length > 0 && (
                        <div className={styles.questionBox}>
                            <h2>{question.title}</h2>
                            <p>{question.description}</p>
                        </div>
                    )}
                    <div className={styles.editorHeader}>solution</div>
                    <textarea
                        className={styles.editor}
                        value={code}
                        onChange={(e) => !submitted && setCode(e.target.value)}
                        onKeyDown={!submitted ? handleKeyDown : undefined}
                        spellCheck="false"
                        autoCorrect="off"
                        autoCapitalize="off"
                        disabled={submitted}
                    />
                </section>
                <section className={styles.aiPanel}>
                    <div className={styles.aiContent}>
                        <h3>Interviewer</h3>
                        <div className={styles.messages}>
                            {messages.map((msg, i) => (
                                <div key={i} className={msg.role === "user" ? styles.userMsg : styles.aiMsg}>
                                    <strong>{msg.role === "user" ? "You" : "Interviewer"}:</strong> {msg.text}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.voiceDock}>
                        <AudioRecorder onNewMessage={setMessages} />
                    </div>
                </section>
            </div>
        </main>
    );
}