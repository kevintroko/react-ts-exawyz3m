import React, { useState } from "react";
import { btnStyle, noteStyle, valStyle } from "./demoStyles";

// --- Question 2 Demos: Direct Mutation & Reference Equality ---
export const BuggyProfile: React.FC = () => {
  const [user, setUser] = useState({ name: "Alex", age: 25 });

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
        {/* Clicking won't trigger a render because the object reference never
        changed. */}
      </small>
    </div>
  );
};

export const FixedProfile: React.FC = () => {
  const [user, setUser] = useState({ name: "Alex", age: 25 });

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
