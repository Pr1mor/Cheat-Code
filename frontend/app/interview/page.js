"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AudioRecorder from "../../components/AudioRecorder";
import styles from "./Interview.module.css";

export default function InterviewPage() {
    const searchParams = useSearchParams();
    const difficulty = searchParams.get("difficulty") || "medium";
    const [code, setCode] = useState("// Type your solution here...");

    const [question, setQuestion] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/start", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ difficulty })
        })
        .then(res => res.json())
        .then(data => setQuestion(data.question));
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newCode = code.substring(0, start) + "    " + code.substring(end);
            setCode(newCode);
            // Restore cursor position after the inserted spaces
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
                <div className={styles.difficultyBadge}>{difficulty.toUpperCase()} MODE</div>
            </header>
            <div className={styles.workspace}>
                <section className={styles.editorContainer}>
                    {/* Question description at the top of the editor */}
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
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck="false"
                        autoCorrect="off"
                        autoCapitalize="off"
                    />
                </section>
                <section className={styles.aiPanel}>
                    <div className={styles.aiContent}>
                        <h3>AI Interviewer</h3>
                        {/* Conversation history */}
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