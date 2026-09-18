import React, { useState } from "react";
import { btnStyle, noteStyle, valStyle } from "./demoStyles.ts";

// --- Question 1 Demos: State Updates & Batching ---
export const BuggyCounter: React.FC = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div>
      <button style={btnStyle} onClick={handleClick}>
        Add +3 (Triple Call)
      </button>
      <p style={valStyle}>
        Current Count: <strong>{count}</strong>
      </p>
      <small style={noteStyle}>
        {/* Notice how clicking only adds +1 because of batched state snapshots. */}
      </small>
    </div>
  );
};

export const FixedCounter: React.FC = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <button style={btnStyle} onClick={handleClick}>
        Add +3 (Functional Updater)
      </button>
      <p style={valStyle}>
        Current Count: <strong>{count}</strong>
      </p>
      <small style={noteStyle}>
        Clicking properly adds +3 because updates use functional state
        callbacks.
      </small>
    </div>
  );
};
