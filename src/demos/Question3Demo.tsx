import React, { useEffect, useState } from "react";
import { btnStyle, noteStyle, valStyle } from "./demoStyles";

// --- Question 3 Demos: Derived State ---
export const BuggyDerived: React.FC = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", isActive: true },
    { id: 2, name: "Bob", isActive: false },
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
        {/* Notice how setting state in useEffect forces cascading renders. */}
      </small>
    </div>
  );
};

export const FixedDerived: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", isActive: true },
    { id: 2, name: "Bob", isActive: false },
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
