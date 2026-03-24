# 🌐 API Optimization in Frontend

---

## 📌 What is API Optimization?

API optimization means **reducing unnecessary network requests** and improving data fetching efficiency.

---

## 🎯 Simple Definition

```
"Fetch less, fetch smart, and fetch only when needed"
```

---

## 🧠 Why API Optimization?

Without optimization:

❌ Too many API calls
❌ Slow performance
❌ Server overload
❌ Bad user experience

With optimization:

✅ Faster apps
✅ Reduced server load
✅ Better UX
✅ Lower costs

---

## ⚙️ Techniques

---

### 🔹 1. Caching API Responses

👉 Store the result so you don't fetch it again

```js
async function fetchWithCache(url) {
  const cached = localStorage.getItem(url);
  if (cached) return JSON.parse(cached);

  const res = await fetch(url);
  const data = await res.json();

  localStorage.setItem(url, JSON.stringify(data));
  return data;
}
```

With expiry (TTL):

```js
function setCache(key, data, ttlMs = 60000) {
  localStorage.setItem(key, JSON.stringify({ data, expiry: Date.now() + ttlMs }));
}

function getCache(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const { data, expiry } = JSON.parse(raw);
  if (Date.now() > expiry) { localStorage.removeItem(key); return null; }
  return data;
}
```

---

### 🔹 2. Debouncing API Calls

👉 Wait until user stops typing before firing the request

```js
import { useState, useEffect } from "react";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(`/api/search?q=${debouncedQuery}`)
      .then(r => r.json())
      .then(console.log);
  }, [debouncedQuery]);

  return <input onChange={e => setQuery(e.target.value)} placeholder="Search..." />;
}
```

👉 Without debounce: 8 calls for "optimize"
👉 With debounce: 1 call after user stops typing ✅

---

### 🔹 3. Pagination

👉 Fetch data in pages instead of all at once

```js
const [page, setPage] = useState(1);
const [items, setItems] = useState([]);

useEffect(() => {
  fetch(`/api/products?page=${page}&limit=10`)
    .then(r => r.json())
    .then(data => setItems(data));
}, [page]);

return (
  <div>
    {items.map(item => <div key={item.id}>{item.name}</div>)}
    <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
    <button onClick={() => setPage(p => p + 1)}>Next</button>
  </div>
);
```

---

### 🔹 4. Infinite Scroll (Alternative to Pagination)

👉 Load more data as user scrolls down

```js
import { useState, useEffect, useRef } from "react";

function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetch(`/api/items?page=${page}&limit=10`)
      .then(r => r.json())
      .then(data => setItems(prev => [...prev, ...data]));
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setPage(p => p + 1);
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      <div ref={loaderRef}>Loading more...</div>
    </div>
  );
}
```

---

### 🔹 5. Avoid Duplicate / Redundant Requests

👉 Don't call the same API again if data already exists

```js
const cache = {};

async function fetchOnce(url) {
  if (cache[url]) {
    console.log("Already fetched, using cache");
    return cache[url];
  }
  const res = await fetch(url);
  cache[url] = await res.json();
  return cache[url];
}
```

In React, also guard with a ref to prevent double-fetching in `useEffect`:

```js
const hasFetched = useRef(false);

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;
  fetch("/api/data").then(r => r.json()).then(setData);
}, []);
```

---

### 🔹 6. Request Batching

👉 Combine multiple API calls into one request

```js
// ❌ Bad — 3 separate requests
fetch("/api/user/1");
fetch("/api/user/2");
fetch("/api/user/3");

// ✅ Good — 1 batched request
fetch("/api/users?ids=1,2,3");
```

Or use `Promise.all` to run them in parallel if batching isn't available:

```js
// ❌ Sequential — slow (each waits for previous)
const user    = await fetch("/api/user");
const posts   = await fetch("/api/posts");
const notifications = await fetch("/api/notifications");

// ✅ Parallel — all fire at once
const [user, posts, notifications] = await Promise.all([
  fetch("/api/user").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
  fetch("/api/notifications").then(r => r.json()),
]);
```

---

### 🔹 7. Lazy Fetching (Fetch on Demand)

👉 Don't fetch until the user actually needs the data

```js
const [data, setData] = useState(null);
const [triggered, setTriggered] = useState(false);

useEffect(() => {
  if (!triggered) return;
  fetch("/api/heavy-data")
    .then(r => r.json())
    .then(setData);
}, [triggered]);

return (
  <div>
    <button onClick={() => setTriggered(true)}>Load Data</button>
    {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
  </div>
);
```

---

### 🔹 8. Cancel Stale Requests (AbortController)

👉 Cancel in-flight requests when the component unmounts or input changes

```js
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setResults)
    .catch(err => {
      if (err.name === "AbortError") return; // expected, ignore
      console.error(err);
    });

  return () => controller.abort(); // cancel on cleanup
}, [query]);
```

👉 Without this, a slow response from a previous query can overwrite newer results.

---

## 🧰 Libraries That Handle This Automatically

| Library      | What It Does                                    |
| ------------ | ----------------------------------------------- |
| React Query  | Caching, deduplication, background refetch, pagination |
| SWR          | Stale-while-revalidate, caching, deduplication  |
| Axios        | Request cancellation, interceptors, timeout     |
| Apollo       | GraphQL caching, batching, pagination           |

React Query example (replaces most manual work):

```js
import { useQuery } from "@tanstack/react-query";

function Products() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then(r => r.json()),
    staleTime: 60000, // cache for 60 seconds
  });

  if (isLoading) return <div>Loading...</div>;
  return <ul>{data.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

---

## ⚠️ Common Mistakes

| Mistake                              | Fix                                  |
| ------------------------------------ | ------------------------------------ |
| Fetching on every render             | Add dependency array to `useEffect`  |
| No caching                           | Use localStorage, React Query, or SWR |
| Fetching all data upfront            | Use pagination or lazy fetching      |
| Sequential requests that can be parallel | Use `Promise.all`               |
| Not cancelling stale requests        | Use `AbortController` in cleanup     |
| Calling same endpoint multiple times | Deduplicate with a cache or ref      |

---

## 🧠 Interview Questions

**Q1: How do you reduce API calls in React?**
👉 Caching, debouncing inputs, pagination, deduplication, and lazy fetching.

---

**Q2: What is pagination vs infinite scroll?**
👉 Pagination loads data in discrete pages. Infinite scroll loads more data automatically as the user scrolls down.

---

**Q3: How do you prevent duplicate API calls in React?**
👉 Use a memory cache object, a `useRef` guard, or a library like React Query which deduplicates automatically.

---

**Q4: What is `AbortController` and why use it?**
👉 A browser API to cancel in-flight fetch requests. Use it in `useEffect` cleanup to prevent stale responses from overwriting newer data.

---

**Q5: Sequential vs parallel requests?**
👉 Sequential awaits each request one by one (slow). Parallel fires all at once with `Promise.all` (fast).

---

## 📚 Summary

* **Cache** — don't re-fetch what you already have
* **Debounce** — don't fetch on every keystroke
* **Paginate** — don't fetch all data at once
* **Batch / parallelize** — don't make more requests than needed
* **Cancel** — don't let stale requests corrupt state
* **Lazy fetch** — don't fetch until it's actually needed

---

## 🔥 Key Takeaway

```
Don't overload your API — optimize your requests.
```

---

⭐ Most API performance problems come from fetching too much, too often, or too eagerly.