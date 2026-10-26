import { useEffect, useRef, useState } from "react";
import { fetchGames, fetchGamesByName } from "../services/gameService";
import GameGrid from "../components/games/GameGrid";
import ScrollToTop from "../components/ScrollToTop";

function ExplorePage() {
  const [error, setError] = useState("");
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadMode, setLoadMode] = useState("initial");

  const sentinelRef = useRef(null);
  const busyRef = useRef(false);
  const hasMoreRef = useRef(true);

  const loading = loadMode != null;

  useEffect(() => {
    let cancelled = false;

    fetchGames(page)
      .then((data) => {

        if (cancelled) {
          return;
        }

        setGames((prev) => {
          const existingIds = new Set(prev.map((g) => g.id));
          const newOnes = data.results.filter((g) => !existingIds.has(g.id));
          return [...prev, ...newOnes];
        });

        setHasMore(Boolean(data.next));
      })
      .catch((err) => {

        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadMode(null);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    busyRef.current = loadMode != null;
    hasMoreRef.current = hasMore;
  });
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !busyRef.current && hasMoreRef.current) {
          busyRef.current = true;
          setLoadMode("append");
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "500px" },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();

    setError("");
    setLoadMode(games.length === 0 ? "initial" : "append");

    try {
      const result = await (searchTerm.trim()
        ? fetchGamesByName(searchTerm)
        : fetchGames(1));

      setGames(result.results);

      if (searchTerm.trim()) {
        setHasMore(false);
      } else {
        setPage(1);
        setHasMore(Boolean(result.next));
      }
    } catch (e) {
      setError(e.message);
      setGames([]);

    } finally {
      setLoadMode(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0c0e13] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
            GameHub / Discover
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Find your next <span className="text-lime-400">adventure.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
            Explore new worlds, discover hidden gems, and find your next
            favorite game.
          </p>
        </header>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="mb-10 flex w-full lg:max-w-2xl max-w-full  gap-3 rounded-xl border border-white/10 bg-[#171a22] p-2 focus-within:border-lime-400/60"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search games..."
            aria-label="Search games"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 sm:text-base"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-lime-400 px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Error and loading states */}
        {error && (
          <p className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading && loadMode === "initial" && (
          <p className="mb-6 text-sm text-lime-300">Finding your games...</p>
        )}

        {/* Game results */}
        {games.length > 0 && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold sm:text-2xl">
                Search results
              </h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                {games.length} games
              </span>
            </div>

            {/* <div className="">
              {games.map((game) => (
                <GameGrid key={game.id}  games={games} />
              ))}
            </div> */}
            <div>
              <GameGrid games={games}/>
            </div>
            
          </section>
        )}
        <div ref={sentinelRef} className="h-10" />

        {loading && loadMode === "append" && (
          <p className="py-4 text-center text-sm text-gray-500">
            Loading more games…
          </p>
        )}

        {!hasMore && !loading && games.length > 0 && (
          <p className="py-4 text-center text-sm text-gray-600">
            You've reached the end.
          </p>
        )}

        {/* Empty state */}
        {!loading && !error && games.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#0c0e13] px-6 py-16 text-center">
            <p className="mb-3 text-4xl text-lime-400">⌕</p>

            <h2 className="text-xl font-semibold">
              {searchTerm.trim()
                ? "No games found"
                : "Your next adventure awaits"}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {searchTerm.trim()
                ? "Try searching for a different game."
                : "Search for a game above to get started."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default ExplorePage;
