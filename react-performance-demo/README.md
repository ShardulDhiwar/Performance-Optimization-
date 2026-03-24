# 🚀 React Performance Optimization

---

## 📌 What is React Performance Optimization?

React performance optimization involves techniques used to **reduce unnecessary re-renders**, improve rendering speed, and make applications more efficient.

---

## 🎯 Why It Matters

* ⚡ Faster UI updates
* 🚀 Better user experience
* 📉 Reduced CPU usage
* 📱 Smooth performance on low-end devices

---

## 🧠 The Core Problem: Unnecessary Re-renders

In React:

👉 When state or props change → component re-renders

But sometimes:

❌ Components re-render even when data hasn't changed
❌ This wastes performance

```
Parent re-renders → Child also re-renders (even if props are the same)
```

---

## ⚙️ Optimization Techniques

### 🔹 1. React.memo

👉 Prevents re-render if **props don't change**

```js
const MyComponent = React.memo(({ value }) => {
  return <div>{value}</div>;
});
```

> ⚠️ React.memo does a **shallow comparison** of props.
> For objects/arrays, consider a custom comparator:

```js
const MyComponent = React.memo(({ user }) => {
  return <div>{user.name}</div>;
}, (prevProps, nextProps) => {
  return prevProps.user.id === nextProps.user.id; // only re-render if id changes
});
```

---

### 🔹 2. useMemo

👉 Memoizes **computed values** — skips recalculation if dependencies haven't changed

```js
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

Real example:

```js
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.price - b.price);
}, [items]);
```

---

### 🔹 3. useCallback

👉 Memoizes **functions** — returns the same function reference between renders

```js
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []);
```

Why it matters with React.memo:

```js
// Without useCallback — new function reference every render → breaks React.memo
<Child onClick={() => doSomething()} />

// With useCallback — same reference → React.memo works correctly
const handleClick = useCallback(() => doSomething(), []);
<Child onClick={handleClick} />
```

---

## ⚔️ Difference Between Them

| Feature    | React.memo       | useMemo        | useCallback     |
| ---------- | ---------------- | -------------- | --------------- |
| Purpose    | Prevent re-render | Cache value   | Cache function  |
| Works On   | Component        | Value          | Function        |
| Returns    | Component        | Computed value | Function ref    |
| Dependency | Props comparison | Dep array      | Dep array       |

---

## ⚙️ Full Example (All Three Together)

```js
import { useState, useMemo, useCallback, memo } from "react";

// Child wrapped in memo — won't re-render unless props change
const ProductList = memo(({ products, onSelect }) => {
  console.log("ProductList rendered");
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id} onClick={() => onSelect(p.id)}>
          {p.name} — ${p.price}
        </li>
      ))}
    </ul>
  );
});

function App() {
  const [filter, setFilter] = useState("");
  const [count, setCount] = useState(0);

  const allProducts = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Phone", price: 499 },
    { id: 3, name: "Tablet", price: 299 },
  ];

  // useMemo — only recalculates when filter changes
  const filtered = useMemo(() => {
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  // useCallback — stable reference so memo on ProductList works
  const handleSelect = useCallback((id) => {
    console.log("Selected:", id);
  }, []);

  return (
    <div>
      <input
        placeholder="Filter products..."
        onChange={(e) => setFilter(e.target.value)}
      />
      <button onClick={() => setCount((c) => c + 1)}>
        Re-render parent ({count})
      </button>
      <ProductList products={filtered} onSelect={handleSelect} />
    </div>
  );
}

export default App;
```

> 👆 Clicking the button re-renders `App` but **ProductList stays the same**
> because `filtered` and `handleSelect` references don't change.

---

## 🔹 4. Lazy Loading (Code Splitting)

👉 Load components only when needed

```js
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

---

## 🔹 5. Virtualization (Large Lists)

👉 Only render items visible on screen — essential for 1000+ item lists

```js
import { FixedSizeList } from "react-window";

<FixedSizeList height={400} itemCount={1000} itemSize={35} width="100%">
  {({ index, style }) => <div style={style}>Row {index}</div>}
</FixedSizeList>
```

---

## 🧠 When to Use

| Situation                              | Tool            |
| -------------------------------------- | --------------- |
| Child re-renders with same props       | `React.memo`    |
| Expensive calculation on every render  | `useMemo`       |
| Passing functions as props to memo'd components | `useCallback` |
| Heavy page/component loaded upfront    | `lazy()`        |
| Rendering 100+ list items              | `react-window`  |

---

## ⚠️ When NOT to Use

* ❌ Small/simple components — overhead isn't worth it
* ❌ No actual performance problem — don't optimize prematurely
* ❌ Overuse makes code harder to read and maintain

> 💡 **Rule of thumb:** Profile first with React DevTools, then optimize.

---

## 🚀 Real World Use Cases

* 📋 Large data tables and lists
* 📊 Dashboards with many widgets
* 🔍 Search/filter interfaces
* 🛒 E-commerce product grids
* 📝 Complex forms

---

## 🧠 Interview Questions

**Q1: What is React.memo?**
👉 A HOC that prevents re-rendering a component if its props haven't changed.

---

**Q2: Difference between useMemo and useCallback?**
👉 `useMemo` caches a computed **value**. `useCallback` caches a **function reference**.

---

**Q3: Why optimize re-renders?**
👉 Unnecessary re-renders waste CPU, slow down the UI, and hurt UX especially on low-end devices.

---

**Q4: Can React.memo break?**
👉 Yes — if you pass a new object/function reference on every render, memo's shallow comparison will always see them as different. Fix with `useMemo`/`useCallback`.

---

**Q5: What tool helps identify performance issues in React?**
👉 **React DevTools Profiler** — shows which components render and how long they take.

---

## 📚 Summary

* React re-renders on every state/prop change
* `React.memo` — skip re-render if props are the same
* `useMemo` — skip recalculation if deps are the same
* `useCallback` — stable function reference across renders
* `lazy()` — load components on demand
* `react-window` — virtualize large lists

---

## 🔥 Key Takeaway

```
Don't re-render what hasn't changed.
```

---

⭐ Optimize only when you have a real problem — measure first, then fix.