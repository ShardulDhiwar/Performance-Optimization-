import React from "react";

function Child({ count }) {
  console.log("Child Rendered");

  return (
    <div className="card">
      <h2>Child Component</h2>
      <p>Count: {count}</p>
    </div>
  );
}

export default React.memo(Child);