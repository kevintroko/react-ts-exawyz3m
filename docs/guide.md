# React Interview Guide — Interviewer Cheat Sheet

> For the interviewer's eyes only. Each question has: the exact prompt to read aloud, the code the candidate sees, hint questions to nudge them, what's actually wrong, the correct answer, and the fix.

**Format suggestion:** Show the candidate the code snippet, read the "Ask" prompt, and let them reason out loud. Use the "Hint questions" only if they get stuck. The "What's wrong" and "Fix" sections are your reference — don't read them unless revealing the answer.

**Question set:** 6 questions, split into _Basic Core_ (1–3) and _Advanced Everyday_ (4–6).

---

## Question 1 — State Updates & Batching

**Category:** Basic Core

### Ask (read aloud)

> "What happens to `count` when the button is clicked once in the snippet below? Does it increase by 1 or by 3?"

### Code the candidate sees

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

### Hint questions (if stuck)

- "What is the value of `count` inside `handleClick` during a single click?"
- "Does calling `setCount` change `count` immediately, or on the next render?"
- "What does each of the three lines actually evaluate to?"

### What's wrong (your reference)

- `count` is a **snapshot** of state for that render. During one click it's `0` the whole time.
- All three calls compute `setCount(0 + 1)` → they all set state to `1`.
- React **batches** the updates, so the component re-renders once with `count = 1`.

### Correct answer

**It increases by 1, not 3.**

### Fix

Use the functional updater so each call receives the latest pending value:

```jsx
const handleClick = () => {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
};
```

---

## Question 2 — Object Mutation in State

**Category:** Basic Core

### Ask (read aloud)

> "Why doesn't the component re-render when the button is clicked?"

### Code the candidate sees

```jsx
function UserProfile() {
  const [user, setUser] = useState({ name: "Alex", age: 25 });

  const updateAge = () => {
    user.age = 26;
    setUser(user);
  };

  return (
    <button onClick={updateAge}>
      {user.name} is {user.age}
    </button>
  );
}
```

### Hint questions (if stuck)

- "How does React decide whether state actually changed?"
- "Is `user` after the mutation a new object, or the same one in memory?"
- "What does `Object.is(oldUser, newUser)` return here?"

### What's wrong (your reference)

- `user.age = 26` **mutates the existing object** in place.
- `setUser(user)` passes the **same object reference** back.
- React uses shallow comparison (`Object.is`). Same reference → React assumes nothing changed → **skips the re-render**.

### Correct answer

**React does a shallow reference comparison, and the reference never changed, so it bails out of rendering.**

### Fix

Create a new object so the reference changes:

```jsx
const updateAge = () => {
  setUser({ ...user, age: user.age + 1 });
};
```

---

## Question 3 — Derived State Antipattern

**Category:** Basic Core

### Ask (read aloud)

> "What is inefficient about this implementation?"

### Code the candidate sees

```jsx
function UserList({ users }) {
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(users.filter((u) => u.isActive));
  }, [users]);

  return <div>{filteredUsers.length} active users</div>;
}
```

### Hint questions (if stuck)

- "How many render cycles happen each time `users` changes?"
- "Do we actually need `filteredUsers` to live in state?"
- "Could this value just be calculated during render?"

### What's wrong (your reference)

- Storing derived data in state + syncing with `useEffect` causes **two renders**: first with stale/empty `filteredUsers`, then a second render after `setFilteredUsers` runs.
- It's redundant state — the filtered list is fully determined by `users`.

### Correct answer

**It triggers an unnecessary second render cycle every time `users` changes (derived state antipattern).**

### Fix

Derive the value directly during render — no state, no effect:

```jsx
function UserList({ users }) {
  const filteredUsers = users.filter((u) => u.isActive);
  return <div>{filteredUsers.length} active users</div>;
}
```

> (If the filter were expensive, wrap it in `useMemo` — but you still don't put it in state.)

---

## Question 4 — Stale Closures & Interval Cleanup

**Category:** Advanced Everyday

### Ask (read aloud)

> "What are two distinct bugs in this code snippet?"

### Code the candidate sees

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

### Hint questions (if stuck)

- "What value of `seconds` does the interval callback capture, and does it ever update?"
- "The effect has an empty dependency array — what does the closure freeze?"
- "What happens to the interval when the component unmounts?"

### What's wrong (your reference)

1. **Stale closure:** the effect runs once, capturing `seconds = 0`. Every tick calls `setSeconds(0 + 1)`, so it sticks at **1**.
2. **Memory leak:** there's no cleanup, so `setInterval` keeps running after unmount (and stacks up on remounts).

### Correct answer

**Bug 1: stale closure — `seconds` is frozen at 0, so it never counts past 1. Bug 2: missing cleanup — the interval is never cleared, causing a memory leak.**

### Fix

Use a functional update (fixes the stale value) and return a cleanup (fixes the leak):

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

---

## Question 5 — Data Fetching Race Conditions

**Category:** Advanced Everyday

### Ask (read aloud)

> "What happens if responses arrive out of order?"

### Code the candidate sees

```jsx
function SearchResults({ query }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(query).then((res) => setData(res));
  }, [query]);

  return <div>{data ? data.title : "Loading..."}</div>;
}
```

### Hint questions (if stuck)

- "If `query` changes quickly, how many requests are in flight?"
- "What if the older request resolves _after_ the newer one?"
- "How could an effect ignore a response that is no longer relevant?"

### What's wrong (your reference)

- Each `query` change fires a new request, but there's no guarantee they resolve in order.
- If an **older** request resolves last, its `setData` overwrites the newer result → **stale UI**.

### Correct answer

**A race condition: a slower, older request can resolve after a newer one and overwrite the correct (newer) data.**

### Fix

Use a cleanup flag (or `AbortController`) to discard stale responses:

```jsx
useEffect(() => {
  let isCurrent = true;

  fetchData(query).then((res) => {
    if (isCurrent) setData(res);
  });

  return () => {
    isCurrent = false;
  };
}, [query]);
```

---

## Question 6 — Object Reference Re-renders

**Category:** Advanced Everyday

### Ask (read aloud)

> "Does `<Child/>` re-render when the Parent counter button is clicked? Why?"

### Code the candidate sees

```jsx
const Child = React.memo(({ config }) => {
  return <div>{config.theme}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Re-render Parent</button>
      <Child config={{ theme: "dark" }} />
    </div>
  );
}
```

### Hint questions (if stuck)

- "`React.memo` compares props — how does it compare an object prop?"
- "Is `{ theme: 'dark' }` the same object on every Parent render?"
- "What kind of comparison does `React.memo` do — deep or shallow?"

### What's wrong (your reference)

- `config={{ theme: 'dark' }}` creates a **brand-new object** on every Parent render.
- `React.memo` does a **shallow comparison**; a new object reference looks like a changed prop → `Child` re-renders even though the value is identical.

### Correct answer

**Yes — `Child` still re-renders. The inline object literal is a new reference each render, defeating `React.memo`.**

### Fix

Give the object a stable reference (hoist it, or `useMemo` if it depends on props/state):

```jsx
const CONFIG = { theme: "dark" };

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <Child config={CONFIG} />
    </div>
  );
}
```

---

## Quick reference table

| #   | Topic                   | One-line answer                                                            |
| --- | ----------------------- | -------------------------------------------------------------------------- |
| 1   | State batching          | Increases by 1 — `count` is a stale snapshot; use `prev => prev + 1`.      |
| 2   | Object mutation         | No re-render — same reference; spread into a new object.                   |
| 3   | Derived state           | Extra render cycle — compute during render, don't store in state.          |
| 4   | Stale closure + cleanup | Frozen at 1 + interval leak — functional update + `clearInterval`.         |
| 5   | Fetch race condition    | Old response overwrites new — use an `isCurrent` flag / `AbortController`. |
| 6   | Reference equality      | Child re-renders — inline object is a new reference; hoist or `useMemo`.   |

### Recurring theme to listen for

Most of these boil down to **two core React ideas**:

1. **State is a snapshot** per render (Q1, Q4).
2. **React compares by reference, not by value** (Q2, Q3, Q6) — and side effects need to account for timing/cleanup (Q4, Q5).

A strong candidate will connect several answers back to these principles.
