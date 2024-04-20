import MoviesList from "./MoviesList";
import WatchedList from "./WatchedList";

export default function Main({ movies, watched }) {
  return (
    <main className="main">
      <MoviesList movies={movies} />
      <WatchedList watched={watched} />
    </main>
  );
}
