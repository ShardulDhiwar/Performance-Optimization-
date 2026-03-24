function Home({ goToAbout, preloadAbout }) {
  return (
    <div>
      <h2>Home Page 🏠</h2>

      <button
        onMouseEnter={preloadAbout} // 👈 Prefetch on hover
        onClick={goToAbout}
        style={{ padding: "10px", marginTop: "10px" }}
      >
        Go to About
      </button>
    </div>
  );
}

export default Home;