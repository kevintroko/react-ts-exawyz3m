import React, { useState, useEffect } from 'react';

// --- Question 1 Demos ---
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
        Notice how clicking only adds +1 because of batched state snapshots.
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

// --- Question 2 Demos ---
export const BuggyProfile: React.FC = () => {
  const [user, setUser] = useState({ name: 'Alex', age: 25 });

  const updateAge = () => {
    user.age = user.age + 1; // Direct mutation
    setUser(user); // Same reference!
  };

  return (
    <div>
      <button style={btnStyle} onClick={updateAge}>
        Increment Age (Mutate directly)
      </button>
      <p style={valStyle}>
        User: {user.name}, Age: <strong>{user.age}</strong>
      </p>
      <small style={noteStyle}>
        Clicking won't trigger a render because the object reference never
        changed.
      </small>
    </div>
  );
};

export const FixedProfile: React.FC = () => {
  const [user, setUser] = useState({ name: 'Alex', age: 25 });

  const updateAge = () => {
    setUser({ ...user, age: user.age + 1 }); // New reference
  };

  return (
    <div>
      <button style={btnStyle} onClick={updateAge}>
        Increment Age (Spread operator)
      </button>
      <p style={valStyle}>
        User: {user.name}, Age: <strong>{user.age}</strong>
      </p>
      <small style={noteStyle}>
        UI updates properly because a new object copy is passed to state.
      </small>
    </div>
  );
};

// --- Question 3 Demos ---
export const BuggyDerived: React.FC = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', isActive: true },
    { id: 2, name: 'Bob', isActive: false },
  ]);
  const [filteredUsers, setFilteredUsers] = useState<typeof users>([]);

  useEffect(() => {
    setRenderCount((r) => r + 1);
  }, []);

  useEffect(() => {
    setFilteredUsers(users.filter((u) => u.isActive));
  }, [users]);

  const addUser = () => {
    const id = Date.now();
    setUsers((prev) => [
      ...prev,
      { id, name: `User ${id % 100}`, isActive: true },
    ]);
  };

  return (
    <div>
      <button style={btnStyle} onClick={addUser}>
        Add Active User
      </button>
      <p style={valStyle}>
        Active Users: <strong>{filteredUsers.length}</strong>
      </p>
      <small style={noteStyle}>
        Notice how setting state in useEffect forces cascading renders.
      </small>
    </div>
  );
};

export const FixedDerived: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', isActive: true },
    { id: 2, name: 'Bob', isActive: false },
  ]);

  // Derived directly during render cycle
  const filteredUsers = users.filter((u) => u.isActive);

  const addUser = () => {
    const id = Date.now();
    setUsers((prev) => [
      ...prev,
      { id, name: `User ${id % 100}`, isActive: true },
    ]);
  };

  return (
    <div>
      <button style={btnStyle} onClick={addUser}>
        Add Active User
      </button>
      <p style={valStyle}>
        Active Users: <strong>{filteredUsers.length}</strong>
      </p>
      <small style={noteStyle}>
        Calculated instantly during render without triggering extra state
        cycles.
      </small>
    </div>
  );
};

// --- Question 4 Demos ---
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
        Stuck at 1 due to stale closure, plus interval keeps leaking on
        remounts.
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

// --- Question 5 Demos ---
export const BuggyFetch: React.FC = () => {
  const [query, setQuery] = useState('React');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const triggerSlowFastRace = () => {
    setLoading(true);
    setResult('Fetching slow request...');

    // Fast request sent 100ms later, but finishes first (300ms)
    // Slow request sent first, but finishes later (1200ms)
    const slowTime = 1200;
    setTimeout(() => {
      setResult('Result for OLD slow request');
      setLoading(false);
    }, slowTime);

    setTimeout(() => {
      setResult('Result for NEW fast request');
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
        The old request finishes last and overrides the newest response.
      </small>
    </div>
  );
};

export const FixedFetch: React.FC = () => {
  const [result, setResult] = useState('');

  const triggerSafeFetch = () => {
    let isCurrent = true;
    setResult('Fetching with cancellation flag...');

    setTimeout(() => {
      if (isCurrent) setResult('Result for NEW fast request');
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

// --- Question 6 Demos ---
const UnmemoizedChild = React.memo(
  ({ config }: { config: { theme: string } }) => {
    return (
      <div
        style={{
          padding: '8px',
          background: '#0f172a',
          borderRadius: '4px',
          marginTop: '8px',
        }}
      >
        Child Render Time: {new Date().toLocaleTimeString()} (Theme:{' '}
        {config.theme})
      </div>
    );
  }
);

export const BuggyMemo: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button style={btnStyle} onClick={() => setCount((c) => c + 1)}>
        Parent Re-render ({count})
      </button>
      <UnmemoizedChild config={{ theme: 'dark' }} />
      <small style={noteStyle}>
        Child re-renders every time because inline object creates a new
        reference.
      </small>
    </div>
  );
};

const STATIC_CONFIG = { theme: 'dark' };

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

const btnStyle: React.CSSProperties = {
  backgroundColor: '#0284c7',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '13px',
};

const valStyle: React.CSSProperties = {
  margin: '10px 0 4px 0',
  color: '#f8fafc',
  fontSize: '15px',
};

const noteStyle: React.CSSProperties = {
  color: '#94a3b8',
  display: 'block',
  fontSize: '12px',
};
