# Basic React Interview Questions & Answers

> Fundamental concepts every React developer should know. Use these as warm-up questions before the code-debugging round in [guide.md](guide.md).

---

## 1. When does React trigger a re-render?

A component re-renders when one of these happens:

1. **Its state changes** — you call a state setter (`useState`/`useReducer`) with a value React considers different (shallow `Object.is` comparison). Setting the _same_ value bails out and skips the render.
2. **Its props change** — because its parent re-rendered and passed new props.
3. **Its parent re-renders** — by default a child re-renders when its parent does, **even if its props didn't change**, unless it's wrapped in `React.memo`.
4. **A consumed context value changes** — any component using `useContext` re-renders when that context's value updates.

Key points to mention:

- Re-rendering means React **calls the component function again** and diffs the result against the virtual DOM — it does **not** necessarily touch the real DOM.
- State is a **snapshot**: within a single render the state variable never changes; the new value shows up on the _next_ render.
- React compares by **reference** for objects/arrays, so a new object/array prop counts as "changed" even if the contents are identical.

---

## 2. Why do lists need a `key`?

`key` gives each list item a **stable identity** so React can track which items changed, were added, or removed during reconciliation. Use a **unique, stable id** — avoid using the array index when the list can reorder or change, because it leads to bugs and inefficient updates.

```jsx
{
  users.map((user) => <li key={user.id}>{user.name}</li>);
}
```

**Why not use the array index as the key?**

The index describes an item's _position_, not its _identity_. When the list is reordered, filtered, or has items inserted/removed, the same index now points to a **different item**, so React reuses the wrong DOM node and component state. This causes:

- **Wrong or "stuck" UI state** — e.g. input values, focus, or checkbox states attach to the wrong row after a reorder or deletion.
- **Incorrect/inefficient DOM updates** — React mutates existing nodes instead of adding/removing them, which can also hurt performance and break animations.

Index keys are only safe when the list is **static** — never reordered, filtered, or added to/removed from — and has no per-item state.

---

## 3. What are the basic rules for a hook?

Hooks must follow the **Rules of Hooks** so React can reliably match each hook call to its state between renders:

1. **Only call hooks at the top level.** Never call them inside loops, conditions, or nested functions — the order and number of hook calls must be the **same on every render**.
2. **Only call hooks from React functions.** Call them from **function components** or **custom hooks**, not from regular JavaScript functions, class components, or event handlers.
3. **Hook names must start with `use`.** This lets React (and the linter) recognize them and enforce the rules.

```jsx
function Component({ show }) {
  const [count, setCount] = useState(0); // ✅ top level

  if (show) {
    const [x, setX] = useState(0); // ❌ conditional — breaks hook order
  }
}
```

> The `eslint-plugin-react-hooks` plugin (included with Create React App) catches most of these violations automatically.

---

## 4. What are the differences and usages between `useCallback` and `useMemo`?

Both memoize something across renders based on a **dependency array**, and both recompute only when a dependency changes. The difference is _what_ they cache:

- **`useCallback(fn, deps)`** memoizes the **function itself** — it returns the same function reference until a dependency changes.
- **`useMemo(() => value, deps)`** memoizes the **return value** — it caches the result of a calculation.

In fact they're related: `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

```jsx
// useCallback — stable function reference
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// useMemo — cached computed value
const sortedList = useMemo(() => items.sort(compare), [items]);
```

**When to use each:**

- **`useCallback`** → when passing a callback to a memoized child (`React.memo`) or as a dependency of another hook, so a new function reference each render doesn't defeat the optimization or retrigger effects.
- **`useMemo`** → when a calculation is **expensive**, or when you need a **stable object/array reference** to pass as a prop or dependency.

> Don't over-use them. Both add overhead and only pay off when they prevent expensive work or unnecessary re-renders — for cheap values, plain variables are better.

---

## 5. What are hooks?

Functions that let **function components** "hook into" React features like state and lifecycle. They always start with `use` and must follow the **Rules of Hooks** (see question 3).

Common built-in hooks: `useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback`, `useReducer`.

---

## 6. What is `useState`?

A hook that adds **local state** to a component. It returns the current value and a setter function.

```jsx
const [count, setCount] = useState(0);
setCount(count + 1); // set directly
setCount((prev) => prev + 1); // functional update (safe for batching)
```

Calling the setter with a **new value** schedules a re-render.

---

## 7. What is `useEffect`?

A hook for running **side effects** — code that reaches outside the render (data fetching, subscriptions, timers, manually touching the DOM). It runs _after_ render.

```jsx
useEffect(() => {
  // effect runs after render
  const id = setInterval(tick, 1000);

  return () => clearInterval(id); // cleanup runs before next effect / on unmount
}, [dependency]); // re-runs only when a dependency changes
```

**Dependency array behavior:**

- `[]` → runs **once** after the first render (mount).
- `[a, b]` → runs after mount and whenever `a` or `b` changes.
- _omitted_ → runs after **every** render.

The **cleanup function** (the returned function) prevents memory leaks and stale subscriptions.

---

## 8. What is `useRef`?

Returns a mutable object (`{ current: ... }`) that **persists across renders** without causing a re-render when changed. Two main uses:

1. **Accessing DOM elements** directly.
2. **Storing a mutable value** that shouldn't trigger re-renders (e.g. a timer id, previous value).

```jsx
const inputRef = useRef(null);
// ...
<input ref={inputRef} />;
inputRef.current.focus();
```

---

## 9. What is `useContext`?

Lets a component read a value from a **Context** without passing props through every level ("prop drilling"). Good for global-ish data like theme, current user, or locale.

```jsx
const theme = useContext(ThemeContext);
```

---

## 10. What is the virtual DOM?

An in-memory representation of the UI. When state changes, React builds a new virtual DOM tree, **diffs** it against the previous one (reconciliation), and applies only the minimal set of real DOM changes. This is faster than re-rendering the whole DOM manually.

---

## 11. What is a controlled component?

A form input whose value is driven by React state. React is the "single source of truth."

```jsx
const [value, setValue] = useState("");
<input value={value} onChange={(e) => setValue(e.target.value)} />;
```

An **uncontrolled** component instead keeps its value in the DOM and is read via a `ref`.

---

## 12. What is `React.memo`?

A higher-order component that **memoizes a component**, skipping its re-render if its props haven't changed (by shallow comparison). Pair it with `useCallback`/`useMemo` for object and function props so the references stay stable.

```jsx
const Child = React.memo(({ value }) => <div>{value}</div>);
```

---

## 13. What is the difference between `useEffect` and `useLayoutEffect`?

Both run after render, but:

- **`useEffect`** runs **asynchronously after paint** — the browser shows the update first. Use this for most side effects.
- **`useLayoutEffect`** runs **synchronously before paint** — use it only when you need to measure or mutate the DOM before the user sees it (to avoid flicker).

---

## 14. What is prop drilling, and how do you avoid it?

**Prop drilling** is passing props through many intermediate components that don't need them, just to reach a deep child. Avoid it with **Context** (`useContext`) or a state-management library (Redux, Zustand, etc.).

---

## Quick reference table

| Concept                   | One-line summary                                          |
| ------------------------- | --------------------------------------------------------- |
| Re-render                 | State change, new props, parent re-render, context change |
| `key`                     | Stable identity for list items (never the array index)    |
| Rules of Hooks            | Top level only, from React functions, `use` prefix        |
| `useCallback` / `useMemo` | Memoize a **function** ref / a **computed value**         |
| Hook                      | `use`-prefixed function to access React features          |
| `useState`                | Adds local state                                          |
| `useEffect`               | Runs side effects after render, with cleanup              |
| `useRef`                  | Mutable value that persists without re-rendering          |
| `useContext`              | Reads shared data without prop drilling                   |
| `React.memo`              | Skips re-render when props are unchanged                  |
| Virtual DOM               | Diff + minimal real DOM updates                           |
