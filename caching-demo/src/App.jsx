import { useEffect, useState } from "react";
import { getCache, setCache } from "./utils/cache";

const API_URL = "https://jsonplaceholder.typicode.com/users";
const CACHE_KEY = "users";
const CACHE_TTL = 1000 * 60 * 1; // 1 minute

function App() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");

  const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
  setStatus("Cache Cleared");
};

  const fetchUsers = async () => {
    const cachedData = getCache(CACHE_KEY);

    if (cachedData) {
      setUsers(cachedData);
      setStatus("Loaded from Cache");
      return;
    }

    setStatus("Fetching from API... ");

    const res = await fetch(API_URL);
    const data = await res.json();

    setUsers(data);
    setCache(CACHE_KEY, data, CACHE_TTL);
    setStatus("Fetched from API ");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Caching Demo </h1>

      <button onClick={fetchUsers}>Reload Data</button>
      <button onClick={clearCache}>Clear Cache</button>


      <p>{status}</p>

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