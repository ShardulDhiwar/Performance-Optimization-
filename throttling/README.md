# ⚡ Throttling in Frontend

---

## 📌 What is Throttling?

Throttling is a technique used to **limit how often a function executes** over time, ensuring it runs at most once in a specified interval.

---

## 🎯 Simple Definition

```
"Execute function at regular intervals, no matter how many times it's triggered"
```

---

## 🧠 Why Throttling is Needed?

Some events fire VERY frequently:

* Scroll 🖱️
* Resize 📐
* Mouse move 🎯

👉 Without throttling:

❌ Too many function calls
❌ Performance drops
❌ UI lag

---

## ⚙️ How Throttling Works

```
Throttle time = 1 second

User scrolls 100 times → Function runs only 1 time per second
```

---

## 🔄 Throttling vs Debouncing

| Feature    | Throttling           | Debouncing          |
| ---------- | -------------------- | ------------------- |
| Execution  | Regular interval     | After delay         |
| Use Case   | Scroll, resize       | Search input        |
| Behavior   | Continuous           | Final action only   |
| Analogy    | Elevator every 30s   | Elevator waits last |

---

## 🔧 Basic Throttle Function

```js
function throttle(func, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = new Date().getTime();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}
```

---

## 💻 Basic Usage Example

```js
const handleScroll = () => {
  console.log("Scroll event:", window.scrollY);
};

const throttledScroll = throttle(handleScroll, 1000);

window.addEventListener("scroll", throttledScroll);
```

👉 No matter how fast the user scrolls, `handleScroll` fires at most once per second.

---

## ⚙️ React Example

```js
import { useEffect, useCallback } from "react";

function throttle(func, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

function App() {
  const handleScroll = useCallback(
    throttle(() => {
      console.log("Scroll Y:", window.scrollY);
    }, 500),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // cleanup
  }, [handleScroll]);

  return <div style={{ height: "200vh" }}>Scroll down...</div>;
}

export default App;
```

---

## ⚙️ Custom useThrottle Hook

```js
import { useRef, useCallback } from "react";

function useThrottle(func, delay = 1000) {
  const lastCall = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      func(...args);
    }
  }, [func, delay]);
}

export default useThrottle;
```

Usage:

```js
import useThrottle from "./useThrottle";

function App() {
  const throttledResize = useThrottle(() => {
    console.log("Window width:", window.innerWidth);
  }, 500);

  useEffect(() => {
    window.addEventListener("resize", throttledResize);
    return () => window.removeEventListener("resize", throttledResize);
  }, [throttledResize]);

  return <div>Resize the window</div>;
}
```

---

## 🧰 Using Lodash (Production Shortcut)

```js
import { throttle } from "lodash";

const throttledScroll = throttle(() => {
  console.log("Scrolled");
}, 1000);

window.addEventListener("scroll", throttledScroll);
```

---

## 🚀 Real World Use Cases

* 📜 Infinite scrolling
* 📐 Window resize handlers
* 🖱️ Mouse move tracking
* 🎮 Game loops / animation frames
* 🔘 Button spam prevention

---

## ⚠️ When NOT to Use

* ❌ Search inputs — use **debouncing** instead
* ❌ When the final value matters — throttle may skip it
* ❌ One-time actions like form submissions — just disable the button

---

## ⚔️ Choosing Between Throttle and Debounce

| Scenario                        | Use           |
| ------------------------------- | ------------- |
| Search bar API call             | Debounce      |
| Scroll position tracking        | Throttle      |
| Window resize handler           | Throttle      |
| Form field validation           | Debounce      |
| Button to prevent double submit | Throttle      |
| Live filtering a list           | Debounce      |

---

## 🧠 Interview Questions

**Q1: What is throttling?**
👉 A technique that limits how often a function runs — at most once per specified interval.

---

**Q2: Difference between throttling and debouncing?**
👉 Throttling runs at **regular intervals** during continuous events. Debouncing runs **once, after** the events stop.

---

**Q3: When would you pick throttle over debounce?**
👉 When you need **continuous feedback** during an event (e.g., scroll position, mouse coordinates) rather than just the final result.

---

**Q4: How do you prevent memory leaks with throttle in React?**
👉 Always remove the event listener in the `useEffect` cleanup function using `removeEventListener`.

---

## 📚 Summary

* Throttling **limits execution rate** to once per interval
* Best for **continuous, high-frequency events** like scroll and resize
* In React: use `useCallback` + `useEffect` cleanup, or a `useThrottle` hook
* In production: use **lodash.throttle**

---

## 🔥 Key Takeaway

```
Don't execute too often — execute smartly.
```

---

⭐ Throttle keeps your app responsive during the noisiest browser events.