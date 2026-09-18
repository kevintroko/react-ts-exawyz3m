import React, { useState } from "react";
import { btnStyle, noteStyle } from "./demoStyles";

// --- Question 6 Demos: Memoization & Reference Stability ---
const UnmemoizedChild = React.memo(
  ({ config }: { config: { theme: string } }) => {
    return (
      <div
        style={{
          padding: "8px",
          background: "#0f172a",
          borderRadius: "4px",
          marginTop: "8px",
        }}
      >
        Child Render Time: {new Date().toLocaleTimeString()} (Theme:{" "}
        {config.theme})
      </div>
    );
  },
);

export const BuggyMemo: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button style={btnStyle} onClick={() => setCount((c) => c + 1)}>
        Parent Re-render ({count})
      </button>
      <UnmemoizedChild config={{ theme: "dark" }} />
      <small style={noteStyle}>
        {/* Child re-renders every time because inline object creates a new
        reference. */}
      </small>
    </div>
  );
};

const STATIC_CONFIG = { theme: "dark" };

export const FixedMemo: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button style={btnStyle} onClick={() => setCount((c) => c + 1)}>
        Parent Re-render ({count})
      </button>
      <UnmemoizedChild config={STATIC_CONFIG} />
      <small style={noteStyle}>
        Child reference stays stable, preventing unnecessary re-renders.
      </small>
    </div>
  );
};
