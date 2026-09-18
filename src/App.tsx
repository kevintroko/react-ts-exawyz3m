import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { questions } from "./questionsData";

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQ = questions[currentIndex];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>React Interview Questions</h1>
        <p style={styles.subtitle}>Test code snippets live by Kevin Cabrera</p>

        <div style={styles.stepBar}>
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                ...styles.stepBtn,
                ...(idx === currentIndex ? styles.activeStepBtn : {}),
              }}
            >
              Q{q.id}
            </button>
          ))}
        </div>
      </header>

      <main style={styles.main}>
        <QuestionCard key={currentQ.id} q={currentQ} />
      </main>

      <footer style={styles.footer}>
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          style={{
            ...styles.navBtn,
            ...(currentIndex === 0 ? styles.disabledBtn : {}),
          }}
        >
          &larr; Previous
        </button>

        <span style={styles.counter}>
          Question {currentIndex + 1} of {questions.length}
        </span>

        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
          }
          disabled={currentIndex === questions.length - 1}
          style={{
            ...styles.navBtn,
            ...(currentIndex === questions.length - 1
              ? styles.disabledBtn
              : {}),
          }}
        >
          Next &rarr;
        </button>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "780px",
    margin: "0 auto",
    padding: "24px 16px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#f8fafc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#ffffff",
    margin: "0 0 6px 0",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: "0 0 16px 0",
  },
  stepBar: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
  },
  stepBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    color: "#94a3b8",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  activeStepBtn: {
    backgroundColor: "#0284c7",
    borderColor: "#38bdf8",
    color: "#ffffff",
  },
  main: {
    flexGrow: 1,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #334155",
  },
  navBtn: {
    backgroundColor: "#334155",
    color: "#ffffff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  disabledBtn: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  counter: {
    color: "#94a3b8",
    fontSize: "13px",
  },
};
