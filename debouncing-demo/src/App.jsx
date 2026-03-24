import { useState } from "react";
import { debounce } from "./utils/debounce";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState("debounce");

  // API call
  const fetchUsers = async (searchText) => {
    console.log("API CALL:", searchText);

    const res = await fetch(API_URL);
    const data = await res.json();

    // simple filter
    const filtered = data.filter((user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setUsers(filtered);
  };

  // Debounced version
  const debouncedFetch = debounce(fetchUsers, 2000);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (mode === "normal") {
      fetchUsers(value); // ❌ many calls
    } else {
      debouncedFetch(value); // ✅ controlled
    }
  };

  return (
    <div>
      <h1>Debouncing Demo 🚀</h1>

      <button onClick={() => setMode("normal")}>
        Normal Mode ❌
      </button>
      <button onClick={() => setMode("debounce")}>
        Debounce Mode ✅
      </button>

      <p>Current Mode: {mode}</p>

      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleChange}
      />

      {users.map((user) => (
        <div className="card" key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default App;