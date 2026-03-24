import { useEffect } from "react";

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

function ScrollTracker() {
  useEffect(() => {
    const handleScroll = throttle(() => {
      console.log("Scroll Y:", window.scrollY);
    }, 500); // runs every 500ms

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div style={{ height: "200vh" }}>Scroll Down 👇</div>;
}

export default ScrollTracker;