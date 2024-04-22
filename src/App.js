import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import MoviesList from "./components/MoviesList";
import WatchedList, { WatchedSummary } from "./components/WatchedList";
import { MovieList } from "./components/MoviesList";
import { WatchList } from "./components/WatchedList";
import axios from "axios";

import { NumResult } from "./components/Navbar";

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

const KEY = "10a55471";

export default function App() {
  const [query, setQuery] = useState("india");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const url = `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(""); // It was a worst bug! hehe
        const response = await axios.get(url);
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
  }, [query, url]);

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

            {!isLoading && !isError && <MovieList movies={movies} />}
          </Box>
        </MoviesList>

        <WatchedList>
          <Box>
            <WatchedSummary watched={watched} />
            <WatchList watched={watched}></WatchList>
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
