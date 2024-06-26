import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import MoviesList from "./components/MoviesList";
import WatchedList, { WatchedSummary } from "./components/WatchedList";
import { MovieList } from "./components/MoviesList";
import { WatchList } from "./components/WatchedList";
import StarRating from "./StarRating";
import axios from "axios";

import { NumResult } from "./components/Navbar";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

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

const KEY = "10a55471";

export default function App() {
  const [query, setQuery] = useState("india");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  // For selected movie

  const [selectedId, setSelectedId] = useState(null);

  const url = `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(""); // It was a worst bug! hehe
        const response = await axios.get(url, {
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        });
        console.log(response);

        if (response.data.Response !== "False") {
          setIsLoading(false);
          setMovies(response.data.Search);
        } else {
          setIsError("Movie not Found!");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setIsError(error.message);
        setIsLoading(false);
      }
    };

    // Search only when query length is at least 2, do not fetch movies
    if (query.length < 3) {
      setMovies([]);
      setIsError("");
      return;
    }
    fetchData();
  }, [query]);

  function handleSelectMovie(id) {
    // setSelectedId(id);
    setSelectedId((currentId) => (id === currentId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }
  return (
    <>
      <Navbar
        query={query}
        setQuery={setQuery}
      >
        <NumResult movies={movies} />
      </Navbar>

      <Main>
        <MoviesList>
          <Box>
            {isLoading && <Loader />}
            {isError && <Error message={isError} />}

            {!isLoading && !isError && (
              <MovieList
                movies={movies}
                onSelectMovie={handleSelectMovie}
              />
            )}
          </Box>
        </MoviesList>

        <WatchedList>
          <Box>
            {selectedId ? (
              <MoviesDetail
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchList watched={watched}></WatchList>
              </>
            )}
          </Box>
        </WatchedList>
      </Main>
    </>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading ...</p>;
}

function Error({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {""}
      {message}
    </p>
  );
}

// This is the MovieDetails Component and it will be shown when any movie is selected from the MoviesList and we'll render it conditionally within the WatchedList component.

function MoviesDetail({ selectedId, onCloseMovie }) {
  console.log(selectedId);
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const {
    Title: title,
    Year: year,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Director: director,
    Actors: actors,
    Plot: plot,
    Poster: poster,
    imdbRating,
  } = movie;

  useEffect(() => {
    async function getMovieDetails() {
      try {
        const response = await axios.get(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
          {
            headers: {
              Accept: "application/json, text/plain, */*",
            },
          }
        );
        console.log(response.data); // Log the actual data
        setMovie(response.data); // Set the state with the data
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }

    getMovieDetails();
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button
              onClick={onCloseMovie}
              className="btn-back"
            >
              &larr;
            </button>

            <img
              src={poster}
              alt={`Poster of ${title} movie`}
            />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          <div className="rating">
            <StarRating maxRating={10} />
          </div>

          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>
              Directed by {director} in the year {year}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
