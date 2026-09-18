import React, { useEffect, useState } from "react";
import { noteStyle, valStyle } from "./demoStyles.ts";

// --- Question 4 Demos: Stale Closures & Effect Cleanup ---
export const BuggyTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    // Missing cleanup & stale closure
  }, []);

  return (
    <div>
      <p style={valStyle}>
        Timer: <strong>{seconds}s</strong>
      </p>
      <small style={noteStyle}>
        {/* Stuck at 1 due to stale closure, plus interval keeps leaking on
        remounts. */}
      </small>
    </div>
  );
};

export const FixedTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p style={valStyle}>
        Timer: <strong>{seconds}s</strong>
      </p>
      <small style={noteStyle}>
        Ticks smoothly using functional updates and clears interval on unmount.
      </small>
    </div>
  );
};
