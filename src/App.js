import { useState, useEffect } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Lifting the state up
  const [query, setQuery] = useState("inception");
  const [selectedId, setSelectedId] = useState("");

  function handleMovieClick(id) {
    // setSelectedId(id);
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleBackClose() {
    setSelectedId(null);
  }

  let url = `http://www.omdbapi.com/?apikey=10a55471&s=${query}`;
  useEffect(() => {
    const controller = new AbortController();
    async function getMovies() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        console.log(response);
        const data = await response.json();

        console.log(data.Response);

        if (!response.ok || data.Response === "False") {
          throw new Error("Something went wrong");
        } else {
          console.log(data);
          setMovies(data.Search);
          setIsLoading(false);
          setIsError(false);
        }
      } catch (err) {
        setIsLoading(false);
        if (err.message !== "AboutError") {
          setIsError(true);
        }

        console.log(err.message);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setIsError(false);
      setIsLoading(false);
      return;
    }
    getMovies();

    // Clean up function to abort requests
    return function () {
      controller.abort();
    };
  }, [query]);

  if (isLoading) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Navbar>
        <Logo />
        <Search
          query={query}
          setQuery={setQuery}
        />
        <NumResults totalMovies={movies?.length} />
      </Navbar>

      <Main>
        <ListBox isError={isError}>
          <MovieList
            movies={movies}
            handleMovieClick={handleMovieClick}
          />
        </ListBox>
        <WatchedBox
          selectedId={selectedId}
          handleBackClose={handleBackClose}
        />
      </Main>
    </>
  );
}

// 1. Navbar
function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  //   const [query, setQuery] = useState("");
  // We lifted this whole state up and made use of the same setter function
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ totalMovies }) {
  return (
    <p className="num-results">
      Found <strong>{totalMovies}</strong> results
    </p>
  );
}

// Main
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// 2. List Box
function ListBox({ children, isError }) {
  const [isOpen1, setIsOpen1] = useState(true);

  if (isError) {
    return (
      <div
        className="box"
        style={{ display: "grid", placeItems: "center", fontSize: "2rem" }}
      >
        <p>
          {" "}
          <button>⛔️</button> &nbsp; Something went wrong!
        </p>
      </div>
    );
  }
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>

      {isOpen1 && <>{children}</>}
    </div>
  );
}

function MovieList({ movies, handleMovieClick }) {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie
          movie={movie}
          key={movie.id}
          handleMovieClick={handleMovieClick}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleMovieClick }) {
  return (
    <li
      key={movie.imdbID}
      onClick={() => handleMovieClick(movie.imdbID)}
    >
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

// 3. WatchedBox
function WatchedBox({ selectedId, handleBackClose }) {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  console.log(selectedId);
  if (selectedId) {
    return (
      <div className="box">
        <MovieDetails
          selectedId={selectedId}
          handleBackClose={handleBackClose}
        />
      </div>
    );
  }
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <MoviesWatched watched={watched} />
          <MovieWatchedDetailList watched={watched} />
        </>
      )}
    </div>
  );
}

// Movie Selection Process
function MovieDetails({ selectedId, handleBackClose }) {
  const [currentMovie, setCurrentMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const {
    Title: title,
    Year: year,
    Released: released,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = currentMovie;

  /* --- Closing the Watched Movies on Escape key press  | This is again a side effect and needs to be handled inside the useEffect --- */

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          handleBackClose();
          console.log("ESCAPE!");
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [handleBackClose]
  );

  // To fetch the movie details
  useEffect(
    function () {
      // To abort too many requests
      async function getMovieDetails() {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=10a55471&i=${selectedId}`
        );

        const result = await response.json();
        console.log(result);

        setCurrentMovie(result);
        setIsLoading(false);
      }

      getMovieDetails();
    },
    [selectedId]
  );

  // Adding the title of the movie to the Browser Title Bar

  useEffect(
    function () {
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopCorn";
        console.log(`Clean up effect for movie ${title} `);
        //closure in action on the above console with title
      };
    },

    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        "LOADING..."
      ) : (
        <>
          <header>
            <button
              className="btn-back"
              onClick={handleBackClose}
            >
              &larr;
            </button>

            <img
              src={poster}
              alt={`Poster of the ${currentMovie}`}
            />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released}</p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <p>
              <em>{plot}</em>
            </p>

            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function MoviesWatched({ watched }) {
  // These are derived states and only belongs to this component
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function MovieWatchedDetailList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <MovieWatchedDetail movie={movie} />
      ))}
    </ul>
  );
}
function MovieWatchedDetail({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
