# 🚀 Caching in Frontend (React)

---

## 📌 What is Caching?

Caching is a **performance optimization technique** where data or resources are stored temporarily so they can be reused instead of fetching them again.

👉 Instead of making repeated network requests, cached data is used to improve speed and efficiency.

---

## 🎯 Why Use Caching?

* ⚡ **Faster Response Time**
* 📉 **Reduced API Calls**
* 🌐 **Less Network Usage**
* 💸 **Reduced Server Load**
* 🚀 **Better User Experience**

---

## 🧠 How Caching Works

Without caching:

```
User Action → API Request → Server → Response
(repeated every time ❌)
```

With caching:

```
User Action → API Request → Store in Cache
Next Time → Use Cached Data ✅
```

---

## 🧩 Types of Caching in Frontend

### 🔹 1. Memory Cache
* Stored in variables (RAM)
* Fastest ⚡
* Lost on refresh

```js
let cache = {};
```

---

### 🔹 2. LocalStorage Cache
* Stored in browser
* Persists after refresh
* Limited size (~5MB)

```js
localStorage.setItem("data", JSON.stringify(data));
```

---

### 🔹 3. SessionStorage
* Similar to localStorage
* Cleared when tab closes

---

### 🔹 4. HTTP Cache (Browser Cache)
* Controlled by headers like:
  * `Cache-Control`
  * `ETag`

---

### 🔹 5. Service Worker Cache (Advanced)
* Works offline
* Used in PWAs

---

## ⚔️ Caching Strategies

### 🔁 1. Cache First

```
Check Cache → If exists → Use it
Else → Fetch from API
```

✔ Fastest &nbsp; ❌ Might show old data

---

### 🔄 2. Network First

```
Fetch from API → If fails → Use cache
```

✔ Fresh data &nbsp; ❌ Slower

---

### 🔁 3. Stale-While-Revalidate (Best 🔥)

```
Return cached data → Fetch new data in background → Update cache
```

✔ Fast + Fresh &nbsp; ✔ Best practice

---

## ⚙️ Basic Implementation (Memory Cache)

```js
let cache = {};

async function fetchData(url) {
  if (cache[url]) {
    console.log("Using cached data");
    return cache[url];
  }

  const res = await fetch(url);
  const data = await res.json();

  cache[url] = data;
  return data;
}
```

---

## ⚙️ LocalStorage Example

```js
async function fetchWithCache() {
  const cached = localStorage.getItem("users");

  if (cached) {
    return JSON.parse(cached);
  }

  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();

  localStorage.setItem("users", JSON.stringify(data));
  return data;
}
```

---

## ⚙️ React Example

```js
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getData() {
      const cached = localStorage.getItem("users");

      if (cached) {
        setUsers(JSON.parse(cached));
        return;
      }

      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();

      localStorage.setItem("users", JSON.stringify(data));
      setUsers(data);
    }

    getData();
  }, []);

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

export default App;
```

---

## ⚙️ Cache with Expiry (TTL)

```js
function setCache(key, data, ttlMs = 60000) {
  const entry = { data, expiry: Date.now() + ttlMs };
  localStorage.setItem(key, JSON.stringify(entry));
}

function getCache(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const { data, expiry } = JSON.parse(raw);
  if (Date.now() > expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
}
```

---

## 🧰 Libraries That Handle Caching for You

| Library         | Strategy                    |
| --------------- | --------------------------- |
| React Query     | Stale-While-Revalidate 🔥   |
| SWR             | Stale-While-Revalidate 🔥   |
| Redux Toolkit Q | Network + Cache             |
| Apollo Client   | For GraphQL APIs            |

---

## ⚠️ Limitations of Caching

* 🕰️ **Stale Data** — Cache may show outdated info
* 💾 **Storage Limits** — LocalStorage capped at ~5MB
* 🔐 **Security** — Never cache sensitive data (tokens, passwords)
* 🔄 **Invalidation** — Knowing when to clear cache is tricky

---

## 🧠 Interview Questions

**Q1: What is caching?**
👉 Temporarily storing data to avoid repeated fetches and improve performance.

---

**Q2: Difference between localStorage and sessionStorage?**
👉 localStorage persists after tab/browser close. sessionStorage clears when the tab closes.

---

**Q3: What is stale-while-revalidate?**
👉 Serve cached data immediately, then fetch fresh data in the background and update.

---

**Q4: When should you NOT cache?**
👉 When data changes frequently, or when it contains sensitive user information.

---

## 📚 Summary

* Caching stores data **temporarily** for reuse
* Types: Memory, LocalStorage, SessionStorage, HTTP, Service Worker
* Best strategy: **Stale-While-Revalidate**
* In React: use **React Query** or **SWR** for production apps

---

## 🔥 Key Takeaway

```
Don't fetch what you already have.
```

---

⭐ Caching is one of the most impactful performance techniques in frontend development.