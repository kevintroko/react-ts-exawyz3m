import React, { useCallback, useState } from "react";
import { noteStyle, valStyle } from "./demoStyles";

// --- Question 7 Demos: Stabilizing an expensive child render with useCallback ---
const ITEMS = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#f8fafc",
  fontSize: "13px",
  marginBottom: "8px",
  width: "100%",
  boxSizing: "border-box",
};

type ResultsListProps = {
  items: { id: number; name: string }[];
  onSelect: (id: number) => void;
};

// Memoized "expensive" list — shows the time of its last render so you can
// see when it needlessly re-renders.
const ResultsList = React.memo(({ items, onSelect }: ResultsListProps) => {
  return (
    <div
      style={{
        padding: "8px",
        background: "#0f172a",
        borderRadius: "4px",
        marginTop: "4px",
      }}
    >
      <div style={{ color: "#f59e0b", fontSize: "12px", marginBottom: "4px" }}>
        List rendered at: {new Date().toLocaleTimeString()}
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            display: "block",
            background: "none",
            border: "none",
            color: "#38bdf8",
            cursor: "pointer",
            fontSize: "13px",
            padding: "2px 0",
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
});

export const BuggySearch: React.FC = () => {
  const [query, setQuery] = useState("");

  // New function on every keystroke → memoized list re-renders anyway.
  const handleSelect = (id: number) => {
    console.log("Selected", id);
  };

  return (
    <div>
      <input
        style={inputStyle}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type here and watch the list's render time..."
      />
      <p style={valStyle}>Search: {query || "(empty)"}</p>
      <ResultsList items={ITEMS} onSelect={handleSelect} />
      <small style={noteStyle}>
        {/* Every keystroke re-renders the list because onSelect is a new
        reference each time. */}
      </small>
    </div>
  );
};

export const FixedSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  // Stable reference → memoized list keeps the same render time while typing.
  const handleSelect = useCallback((id: number) => {
    console.log("Selected", id);
  }, []);

  return (
    <div>
      <input
        style={inputStyle}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type here — the list's render time stays put..."
      />
      <p style={valStyle}>Search: {query || "(empty)"}</p>
      <ResultsList items={ITEMS} onSelect={handleSelect} />
      <small style={noteStyle}>
        useCallback keeps onSelect stable, so the memoized list skips
        re-rendering on each keystroke.
      </small>
    </div>
  );
};
