import { useState } from "react";
import Child from "./components/Child";

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  return (
    <div>
      <h1>React Performance Demo 🚀</h1>

      <button onClick={() => setCount(count + 1)}>
        Increase Count
      </button>

      <input
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
      />

      <Child count={count} />
    </div>
  );
}

export default App;