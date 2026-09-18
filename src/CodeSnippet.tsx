import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  code: string;
  title?: string;
  language?: string;
}

export const CodeSnippet: React.FC<Props> = ({
  code,
  title = "snippet.tsx",
  language = "tsx",
}) => {
  return (
    <div style={styles.window}>
      <div style={styles.titleBar}>
        <div style={styles.dots}>
          <span style={{ ...styles.dot, backgroundColor: "#ff5f56" }} />
          <span style={{ ...styles.dot, backgroundColor: "#ffbd2e" }} />
          <span style={{ ...styles.dot, backgroundColor: "#27c93f" }} />
        </div>
        <span style={styles.fileName}>{title}</span>
        <span style={styles.spacer} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "16px",
          background: "#1e1e1e",
          fontSize: "13.5px",
          lineHeight: "1.5",
        }}
        codeTagProps={{
          style: {
            fontFamily:
              "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
          },
        }}
        lineNumberStyle={{ color: "#5a5a5a", minWidth: "2.5em" }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  window: {
    borderRadius: "8px",
    border: "1px solid #333",
    overflow: "hidden",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  titleBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#323233",
    padding: "8px 12px",
    borderBottom: "1px solid #252526",
  },
  dots: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    display: "inline-block",
  },
  fileName: {
    flex: 1,
    textAlign: "center",
    color: "#cccccc",
    fontSize: "12px",
    fontFamily: "'Fira Code', Consolas, Monaco, monospace",
  },
  spacer: {
    width: "54px",
  },
};
