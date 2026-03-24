# ⚡ Preloading & Prefetching in Frontend

---

## 📌 What is Preloading & Prefetching?

These are techniques used to **load resources in advance** to improve performance and user experience.

---

## 🎯 Simple Definition

```
Preload  → Load important resources for the CURRENT page ASAP
Prefetch → Load resources for FUTURE pages in the background
```

---

## 🧠 Why It Matters

Without it:

❌ Delays when navigating
❌ Slower interactions
❌ Resources discovered late

With it:

✅ Faster navigation
✅ Smooth experience
✅ Resources ready before needed

---

## ⚔️ Preload vs Prefetch

| Feature      | Preload               | Prefetch              |
| ------------ | --------------------- | --------------------- |
| Purpose      | Current page          | Future page           |
| Priority     | High — loads ASAP     | Low — loads at idle   |
| When used    | Immediately           | Background / idle     |
| Use for      | Hero images, fonts, critical CSS | Next route's JS, data |
| Risk if overused | Competes with critical resources | Wastes bandwidth |

---

## ⚡ Preloading

👉 Tells the browser: *"You will need this soon — fetch it now"*

```html
<!-- Preload an image -->
<link rel="preload" href="/hero.webp" as="image" />

<!-- Preload a font -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />

<!-- Preload a script -->
<link rel="preload" href="/critical.js" as="script" />

<!-- Preload CSS -->
<link rel="preload" href="/critical.css" as="style" />
```

> ⚠️ Always include the `as` attribute — without it the browser ignores the hint.

---

## 🚀 Prefetching

👉 Tells the browser: *"The user might need this next — fetch it when idle"*

```html
<!-- Prefetch next page JS -->
<link rel="prefetch" href="/about.chunk.js" />

<!-- Prefetch an image for the next page -->
<link rel="prefetch" href="/about-hero.webp" as="image" />
```

---

## 🔄 DNS Prefetch & Preconnect

> Even faster navigation by resolving DNS and opening connections early.

```html
<!-- Resolve DNS for a third-party domain -->
<link rel="dns-prefetch" href="https://api.example.com" />

<!-- Open TCP + TLS connection early (stronger than dns-prefetch) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

| Hint           | What It Does                              | Use When                  |
| -------------- | ----------------------------------------- | ------------------------- |
| `dns-prefetch` | Resolves domain name early                | 3rd party APIs, CDNs      |
| `preconnect`   | DNS + TCP + TLS handshake early           | Google Fonts, analytics   |
| `preload`      | Fetches the actual resource               | Critical current-page assets |
| `prefetch`     | Fetches resource for future navigation    | Next route assets         |

---

## ⚙️ Prefetching in React (Webpack)

```js
// Prefetch — loads in background at idle time
const About = lazy(() =>
  import(/* webpackPrefetch: true */ "./pages/About")
);

// Preload — loads immediately (parallel with current chunk)
const Modal = lazy(() =>
  import(/* webpackPreload: true */ "./components/Modal")
);
```

> 💡 `webpackPrefetch` injects `<link rel="prefetch">` into the HTML automatically.

---

## ⚙️ Prefetching in React Router (on hover)

👉 Start loading the next page when user hovers a link — before they even click:

```js
import { lazy, useState } from "react";

const About = lazy(() => import("./pages/About"));

function NavLink() {
  const [prefetched, setPrefetched] = useState(false);

  const handleHover = () => {
    if (!prefetched) {
      import("./pages/About"); // trigger the load
      setPrefetched(true);
    }
  };

  return (
    <a href="/about" onMouseEnter={handleHover}>
      About
    </a>
  );
}
```

👉 By the time the user clicks, the chunk is already downloaded.

---

## ⚙️ Preloading API Data (React Query)

```js
import { queryClient } from "./queryClient";

// Prefetch data before user navigates
async function prefetchAboutData() {
  await queryClient.prefetchQuery({
    queryKey: ["about"],
    queryFn: () => fetch("/api/about").then(r => r.json()),
  });
}

// Trigger on hover
<a
  href="/about"
  onMouseEnter={prefetchAboutData}
>
  About
</a>
```

---

## 🚀 Real World Use Cases

| Technique       | Example                                          |
| --------------- | ------------------------------------------------ |
| Preload image   | Hero banner on landing page                      |
| Preload font    | Custom brand font used above the fold            |
| Prefetch route  | Dashboard JS when user is on the login page      |
| Preconnect      | Google Fonts, Stripe, analytics domains          |
| Hover prefetch  | Nav links that trigger chunk download on hover   |
| Prefetch data   | Load next page's API data before user navigates  |

---

## ⚠️ Things to Remember

* ❌ Don't preload everything — it competes with truly critical resources
* ❌ Don't prefetch on slow/metered connections — wastes user's data
* ✅ Preload only what's **above the fold** on the current page
* ✅ Prefetch only what the user is **likely to visit next**
* ✅ `preconnect` > `dns-prefetch` for frequently used third-party origins

---

## 🧠 Interview Questions

**Q1: Difference between preload and prefetch?**
👉 Preload fetches critical resources for the **current** page immediately. Prefetch fetches resources for a **future** page at idle time.

---

**Q2: When should you use prefetch?**
👉 When there's a high likelihood the user will navigate to a specific route next — e.g. prefetching the dashboard JS while the user is on the login page.

---

**Q3: What's the difference between preconnect and dns-prefetch?**
👉 `dns-prefetch` only resolves the domain name. `preconnect` goes further — it also completes the TCP and TLS handshake, saving more time.

---

**Q4: Can prefetching hurt performance?**
👉 Yes — over-prefetching wastes bandwidth and can delay higher-priority resources. Only prefetch what users are likely to actually need.

---

**Q5: How does Webpack's `webpackPrefetch` work?**
👉 It adds a `<link rel="prefetch">` tag to the page's HTML, instructing the browser to load that chunk during idle time.

---

## 📚 Summary

* **Preload** → high priority, current page, loads immediately
* **Prefetch** → low priority, future page, loads at idle
* **Preconnect** → early TCP/TLS for third-party origins
* **Hover prefetch** → best UX trick — load on intent, not on click
* Don't overuse — be strategic about what you load early

---

## 🔥 Key Takeaway

```
Load before the user asks for it — but only what they're likely to need.
```

---

⭐ Preloading and prefetching are the last mile of performance — the difference between fast and *instant*.