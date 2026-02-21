"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AudioRecorder from "../../components/AudioRecorder";
import styles from "./Interview.module.css";

export default function InterviewPage() {
    const searchParams = useSearchParams();
    const difficulty = searchParams.get("difficulty") || "medium";
    const [code, setCode] = useState("// Type your solution here...");

    return (
        <main className={styles.container}>
            {/* Header with Difficulty Info */}
            <header className={styles.header}>
                <div className={styles.logo}>Cheat<span>Code</span></div>
                <div className={styles.difficultyBadge}>{difficulty.toUpperCase()} MODE</div>
            </header>

            <div className={styles.workspace}>
                {/* LEFT SIDE: The Code Editor */}
                <section className={styles.editorContainer}>
                    <div className={styles.editorHeader}>solution</div>
                    <textarea
                        className={styles.editor}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck="false"
                    />
                </section>

                {/* RIGHT SIDE: The AI Interaction */}
                <section className={styles.aiPanel}>
                    <div className={styles.aiContent}>
                        <h3>AI Interviewer</h3>
                        <p>Listen to the problem and explain your logic as you type.</p>
                    </div>

                    {/* YOUR VOICE BUTTON LIVES HERE */}
                    <div className={styles.voiceDock}>
                        <AudioRecorder />
                    </div>
                </section>
            </div>
        </main>
    );
}