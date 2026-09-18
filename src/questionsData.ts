import { BuggyCounter, FixedCounter } from "./demos/Question1Demo.tsx";
import { BuggyProfile, FixedProfile } from "./demos/Question2Demo.tsx";
import { BuggyDerived, FixedDerived } from "./demos/Question3Demo.tsx";
import { BuggyTimer, FixedTimer } from "./demos/Question4Demo.tsx";
import { BuggyFetch, FixedFetch } from "./demos/Question5Demo.tsx";
import { BuggyMemo, FixedMemo } from "./demos/Question6Demo.tsx";
import { QuestionData } from "./types";

export const questions: QuestionData[] = [
  {
    id: 1,
    title: "State Updates & Batching",
    category: "Basic Core",
    question:
      "What happens to 'count' when the button is clicked once in the snippet below? Does it increase by 1 or by 3?",
    codeSnippet: `function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}`,
    answer: "The count increases by 1, not 3.",
    explanation:
      "State updates inside event handlers are batched, and 'count' refers to the snapshot value during that specific render. All three calls evaluate to setCount(0 + 1).",
    fixedCode: `const handleClick = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
};`,
    BuggyDemo: BuggyCounter,
    FixedDemo: FixedCounter,
  },
  {
    id: 2,
    title: "Object Mutation in State",
    category: "Basic Core",
    question: "Why doesn't the component re-render when the button is clicked?",
    codeSnippet: `function UserProfile() {
  const [user, setUser] = useState({ name: 'Alex', age: 25 });

  const updateAge = () => {
    user.age = 26;
    setUser(user);
  };

  return <button onClick={updateAge}>{user.name} is {user.age}</button>;
}`,
    answer:
      "React performs shallow comparison (Object.is) to check if state changed.",
    explanation:
      "Mutating 'user.age' directly modifies the existing object in memory. 'setUser(user)' passes the exact same object reference, so React skips re-rendering.",
    fixedCode: `const updateAge = () => {
  setUser({ ...user, age: user.age + 1 });
};`,
    BuggyDemo: BuggyProfile,
    FixedDemo: FixedProfile,
  },
  {
    id: 3,
    title: "Derived State Antipattern",
    category: "Basic Core",
    question: "What is inefficient about this implementation?",
    codeSnippet: `function UserList({ users }) {
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(users.filter(u => u.isActive));
  }, [users]);

  return <div>{filteredUsers.length} active users</div>;
}`,
    answer:
      "It triggers an unnecessary second render cycle whenever 'users' changes.",
    explanation:
      "Passing props into state via useEffect causes a render with old state, followed immediately by a second render when setFilteredUsers runs.",
    fixedCode: `// Derive directly during render!
function UserList({ users }) {
  const filteredUsers = users.filter(u => u.isActive);
  return <div>{filteredUsers.length} active users</div>;
}`,
    BuggyDemo: BuggyDerived,
    FixedDemo: FixedDerived,
  },
  {
    id: 4,
    title: "Stale Closures & Interval Cleanup",
    category: "Advanced Everyday",
    question: "What are two distinct bugs in this code snippet?",
    codeSnippet: `function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
  }, []);

  return <div>Seconds: {seconds}</div>;
}`,
    answer:
      "1. Stale Closure bug (seconds stays at 1).\n2. Memory Leak (interval is never cleared).",
    explanation:
      "The effect callback captures initial 'seconds' (0). Every second it sets (0 + 1). Also, missing a cleanup function leaves intervals running on unmount.",
    fixedCode: `useEffect(() => {
  const interval = setInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);`,
    BuggyDemo: BuggyTimer,
    FixedDemo: FixedTimer,
  },
  {
    id: 5,
    title: "Data Fetching Race Conditions",
    category: "Advanced Everyday",
    question: "What happens if responses arrive out of order?",
    codeSnippet: `function SearchResults({ query }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(query).then(res => setData(res));
  }, [query]);

  return <div>{data ? data.title : 'Loading...'}</div>;
}`,
    answer:
      "A race condition occurs where slower older requests overwrite newer ones.",
    explanation:
      "If request A (older query) finishes after request B (newer query), the component will render stale data for request A.",
    fixedCode: `useEffect(() => {
  let isCurrent = true;

  fetchData(query).then(res => {
    if (isCurrent) setData(res);
  });

  return () => { isCurrent = false; };
}, [query]);`,
    BuggyDemo: BuggyFetch,
    FixedDemo: FixedFetch,
  },
  {
    id: 6,
    title: "Object Reference Re-renders",
    category: "Advanced Everyday",
    question:
      "Does <Child/> re-render when Parent counter button is clicked? Why?",
    codeSnippet: `const Child = React.memo(({ config }) => {
  return <div>{config.theme}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Re-render Parent</button>
      <Child config={{ theme: 'dark' }} />
    </div>
  );
}`,
    answer: "Yes, Child re-renders despite React.memo.",
    explanation:
      "Inline object config={{ theme: 'dark' }} creates a new object instance in memory on every Parent render. React.memo detects a new prop reference and forces a re-render.",
    fixedCode: `const CONFIG = { theme: 'dark' };

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <Child config={CONFIG} />
    </div>
  );
}`,
    BuggyDemo: BuggyMemo,
    FixedDemo: FixedMemo,
  },
];
