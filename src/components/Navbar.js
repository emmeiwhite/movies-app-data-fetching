import Search from "./Search";

export default function Navbar({ children, query, setQuery }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search
        query={query}
        setQuery={setQuery}
      />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

export function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
