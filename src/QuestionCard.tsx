import React, { useState } from "react";
import { CodeSnippet } from "./CodeSnippet";
import { QuestionData } from "./types";

interface Props {
  q: QuestionData;
}

export const QuestionCard: React.FC<Props> = ({ q }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [demoMode, setDemoMode] = useState<"buggy" | "fixed">("buggy");

  const BuggyDemo = q.BuggyDemo;
  const FixedDemo = q.FixedDemo;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.badge}>{q.category}</span>
        <h2 style={styles.title}>
          Question {q.id}: {q.title}
        </h2>
      </div>

      <p style={styles.questionText}>{q.question}</p>

      {/* Code Snippet Box */}
      <CodeSnippet
        code={q.codeSnippet}
        title={`Question ${q.id} — snippet.tsx`}
      />

      {/* Live Interactive Sandbox */}
      <div style={styles.interactiveBox}>
        <div style={styles.interactiveHeader}>
          <span>Interactive Test Playground</span>
          <div style={styles.tabBar}>
            <button
              onClick={() => setDemoMode("buggy")}
              style={{
                ...styles.tabBtn,
                ...(demoMode === "buggy" ? styles.activeTabBuggy : {}),
              }}
            >
              Test Code
            </button>
            <button
              onClick={() => setDemoMode("fixed")}
              style={{
                ...styles.tabBtn,
                ...(demoMode === "fixed" ? styles.activeTabFixed : {}),
              }}
            >
              Test Fixed Code
            </button>
          </div>
        </div>

        <div style={styles.demoContainer}>
          {demoMode === "buggy" ? <BuggyDemo /> : <FixedDemo />}
        </div>
      </div>

      {/* Toggle Answer Button */}
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        style={styles.toggleBtn}
      >
        {showAnswer ? "Hide Solution" : "Reveal Answer & Explanation"}
      </button>

      {/* Answer & Explanation */}
      {showAnswer && (
        <div style={styles.answerSection}>
          <h3 style={styles.answerHeader}>Short Answer</h3>
          <p style={styles.answerText}>{q.answer}</p>

          <h3 style={styles.answerHeader}>Why It Happens</h3>
          <p style={styles.explanationText}>{q.explanation}</p>

          <h3 style={styles.answerHeader}>Fixed Code</h3>
          <CodeSnippet code={q.fixedCode} title="solution.tsx" />
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #334155",
    marginBottom: "20px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  badge: {
    backgroundColor: "#0284c7",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    color: "#f8fafc",
  },
  questionText: {
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "20px",
  },
  interactiveBox: {
    backgroundColor: "#0f172a",
    borderRadius: "8px",
    border: "1px solid #334155",
    padding: "16px",
    marginBottom: "20px",
  },
  interactiveHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    color: "#f8fafc",
    fontSize: "14px",
    fontWeight: "600",
  },
  tabBar: {
    display: "flex",
    gap: "6px",
  },
  tabBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    color: "#94a3b8",
    padding: "4px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  activeTabBuggy: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderColor: "#f87171",
  },
  activeTabFixed: {
    backgroundColor: "#22c55e",
    color: "#ffffff",
    borderColor: "#4ade80",
  },
  demoContainer: {
    backgroundColor: "#1e293b",
    borderRadius: "6px",
    padding: "16px",
    border: "1px solid #334155",
  },
  toggleBtn: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    width: "100%",
  },
  answerSection: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #334155",
  },
  answerHeader: {
    color: "#38bdf8",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginTop: "16px",
    marginBottom: "6px",
  },
  answerText: {
    color: "#f1f5f9",
    fontWeight: "bold",
    fontSize: "15px",
    margin: 0,
  },
  explanationText: {
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: 0,
  },
};
