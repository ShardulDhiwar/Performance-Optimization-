# 🚀 Debouncing in JavaScript & React

---

## 📌 What is Debouncing?

Debouncing is a technique used to **delay the execution of a function** until a certain amount of time has passed since the last event.

👉 It is commonly used to prevent excessive function calls.

---

## 🎯 Why Use Debouncing?

* ⚡ Reduce unnecessary API calls
* 🚀 Improve performance
* 💸 Save server cost
* 😊 Better user experience

---

## 🧠 How It Works

```
User types → Timer starts
User types again → Timer resets
User stops typing → Function executes
```

---

## ⚔️ Debouncing vs Without Debouncing

| Scenario          | API Calls      |
| ----------------- | -------------- |
| Without Debounce  | 5–10 calls ❌  |
| With Debounce     | 1 call ✅      |

---

## ⚙️ Basic JavaScript Implementation

```js
function debounce(func, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
```

---

## 💻 Example Usage

```js
const search = (query) => {
  console.log("Searching for:", query);
};

const debouncedSearch = debounce(search, 500);

debouncedSearch("h");
debouncedSearch("he");
debouncedSearch("hel");
// 👉 Only the last call executes after 500ms
```

---

## ⚙️ React Example (Basic)

```js
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");

  const handleSearch = (value) => {
    console.log("API Call:", value);
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = debounce(handleSearch, 500);

  return (
    <input
      type="text"
      placeholder="Search..."
      onChange={(e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}

export default App;
```

---

## ⚙️ React Example (Correct Way with useCallback)

> ⚠️ The basic example above recreates the debounce function on every render.
> Use `useCallback` to fix this:

```js
import { useState, useCallback } from "react";

function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

function App() {
  const [query, setQuery] = useState("");

  const handleSearch = (value) => {
    console.log("API Call:", value);
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  return (
    <input
      type="text"
      placeholder="Search..."
      onChange={(e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}

export default App;
```

---

## ⚙️ Custom useDebounce Hook

> Reusable hook — the cleanest approach for React projects:

```js
import { useState, useEffect } from "react";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup on every change
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
```

Usage:

```js
import { useState } from "react";
import useDebounce from "./useDebounce";

function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      console.log("API Call:", debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      placeholder="Search..."
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

---

## 🧰 Using Lodash (Production Shortcut)

```js
import { debounce } from "lodash";

const debouncedSearch = debounce((value) => {
  console.log("API Call:", value);
}, 500);
```

---

## ⚔️ Debounce vs Throttle

| Feature     | Debounce                        | Throttle                       |
| ----------- | ------------------------------- | ------------------------------ |
| Executes    | After user **stops** triggering | At **fixed intervals**         |
| Best for    | Search input, form validation   | Scroll, resize, mouse move     |
| Analogy     | Elevator waits for last person  | Elevator leaves every 30 sec   |

---

## 🚀 Real World Use Cases

* 🔍 Search bars
* 📊 Filters & dropdowns
* 🧾 Form validation
* 🌐 API calls on input
* 📐 Window resize handlers

---

## ⚠️ Limitations

* ⏳ Adds intentional delay — not for real-time actions
* 🔁 Can miss intermediate values if delay is too long
* ⚙️ Needs cleanup in React to avoid memory leaks

---

## 🧠 Interview Questions

**Q1: What is debouncing?**
👉 Delaying function execution until the user stops triggering events.

---

**Q2: Why use debouncing?**
👉 To reduce unnecessary function calls and improve performance.

---

**Q3: Difference between debounce and throttle?**
👉 Debounce waits for the user to stop. Throttle fires at regular intervals regardless.

---

**Q4: How do you debounce correctly in React?**
👉 Define the debounced function outside the component, or use `useCallback` / a custom `useDebounce` hook to avoid recreation on every render.

---

## 📚 Summary

* Debouncing **delays** execution until events stop
* Prevents **excessive API calls**
* In React: use a **custom hook** or **useCallback** for correctness
* In production: use **lodash.debounce**

---

## 🔥 Key Takeaway

```
Wait before executing — don't rush every event.
```

---

⭐ Debouncing is essential for any input-driven interaction in modern web apps.