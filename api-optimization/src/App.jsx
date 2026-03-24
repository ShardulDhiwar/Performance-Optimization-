import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const CACHE_KEY = `users_page_${page}`;
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      console.log("Loaded from cache");
      setUsers(JSON.parse(cached));
      return;
    }

    fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=3`)
      .then(res => res.json())
      .then(data => {
        console.log("API called");
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        setUsers(data);
      });
  }, [page]);

  return (
    <div>
      <h1>Users</h1>

      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}

      <button onClick={() => setPage(prev => prev - 1)} disabled={page === 1}>
        Prev
      </button>

      <button onClick={() => setPage(prev => prev + 1)}>
        Next
      </button>
    </div>
  );
}

export default App;