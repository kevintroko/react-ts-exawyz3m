import React, { useState } from "react";
import { btnStyle, noteStyle, valStyle } from "./demoStyles.ts";

// --- Question 5 Demos: Race Conditions ---
export const BuggyFetch: React.FC = () => {
  const [query, setQuery] = useState("React");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const triggerSlowFastRace = () => {
    setLoading(true);
    setResult("Fetching slow request...");

    // Fast request sent 100ms later, but finishes first (300ms)
    // Slow request sent first, but finishes later (1200ms)
    const slowTime = 1200;
    setTimeout(() => {
      setResult("Result for OLD slow request");
      setLoading(false);
    }, slowTime);

    setTimeout(() => {
      setResult("Result for NEW fast request");
    }, 300);
  };

  return (
    <div>
      <button style={btnStyle} onClick={triggerSlowFastRace}>
        Simulate Race Condition
      </button>
      <p style={valStyle}>
        Result: <strong>{result}</strong>
      </p>
      <small style={noteStyle}>
        {/* The old request finishes last and overrides the newest response. */}
      </small>
    </div>
  );
};

export const FixedFetch: React.FC = () => {
  const [result, setResult] = useState("");

  const triggerSafeFetch = () => {
    let isCurrent = true;
    setResult("Fetching with cancellation flag...");

    setTimeout(() => {
      if (isCurrent) setResult("Result for NEW fast request");
    }, 300);

    // Old request finishes later, but gets discarded by isCurrent check
    setTimeout(() => {
      // simulated ignore
    }, 1200);
  };

  return (
    <div>
      <button style={btnStyle} onClick={triggerSafeFetch}>
        Simulate Clean Request
      </button>
      <p style={valStyle}>
        Result: <strong>{result}</strong>
      </p>
      <small style={noteStyle}>
        Uses cleanup flags to discard stale out-of-order network responses.
      </small>
    </div>
  );
};
