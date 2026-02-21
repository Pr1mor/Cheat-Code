"use client";
import { useRouter } from "next/navigation";
import styles from "./Home.module.css";

export default function LandingPage() {
  const router = useRouter();

  const startInterview = async (difficulty) => {
    try {
      await fetch("http://localhost:8000/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty }),
      });
    } catch (err) {
      console.error("Failed to send difficulty to server:", err);
    }
    router.push(`/interview?difficulty=${difficulty}`);
  };

  return (
    <main className={styles.container}>
      <div className={styles.logo}>CheatCode</div>

      <h1 className={styles.title}>Select Your Difficulty</h1>
      <div>
        <s></s>
      </div>
      <div className={styles.buttonGrid}>
        <button
          onClick={() => startInterview("easy")}
          className={`${styles.card} ${styles.easy}`}
        >
          <h2>Easy</h2>
        </button>
        <button
          onClick={() => startInterview("medium")}
          className={`${styles.card} ${styles.medium}`}
        >
          <h2>Medium</h2>
        </button>
        <button
          onClick={() => startInterview("hard")}
          className={`${styles.card} ${styles.hard}`}
        >
          <h2>Hard</h2>
        </button>
      </div>
    </main>
  );
}
