import { useState, lazy, Suspense } from "react";

// Lazy loaded components
const Home = lazy(() => import("./Home"));
const About = lazy(() => import("./About"));

function App() {
  const [page, setPage] = useState("home");

  // 👇 Prefetch function
  const preloadAbout = () => {
    import("./About");
    console.log("Prefetching About page 🚀");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Preloading & Prefetching Demo ⚡</h1>

      <Suspense fallback={<h2>Loading...</h2>}>
        {page === "home" ? (
          <Home 
            goToAbout={() => setPage("about")} 
            preloadAbout={preloadAbout}
          />
        ) : (
          <About />
        )}
      </Suspense>
    </div>
  );
}

export default App;