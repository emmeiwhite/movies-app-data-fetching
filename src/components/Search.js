import { useState } from "react";

export default function Search({ query, setQuery }) {
  const handleSearch = (e) => {
    setQuery(e.target.value);
    console.log(query);
  };
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={handleSearch}
    />
  );
}
