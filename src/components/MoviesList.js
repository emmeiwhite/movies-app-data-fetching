import { useState } from "react";

export default function MoviesList({ movies }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>

      {isOpen1 && (
        <ul className="list">
          {movies?.map((movie) => (
            <Movie movie={movie} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Movie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}