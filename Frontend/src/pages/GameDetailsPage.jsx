import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGameById, fetchGameScreenshots } from "../services/gameService";
import { Link } from "react-router-dom";

function GameDetailsPage() {
  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [screenshots, setScreenshots] = useState([]);
  const [screenshotError, setScreenshotError] = useState("");

  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  useEffect(() => {
    async function loadGame() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchGameById(id);
        setGame(result);
        // console.log(game?.short_screenshots);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [id]);

  useEffect(() => {
    async function loadScreenshot() {
      try {
        const result = await fetchGameScreenshots(id);
        setScreenshots(result.results ?? []);
      } catch (e) {
        setScreenshotError(e.message);
      }
    }
    loadScreenshot();
  }, [id]);

  useEffect(() => {
    if (selectedScreenshot) {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          setSelectedScreenshot(null);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [selectedScreenshot]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0e13] p-8 text-white">
        Loading game details...
      </main>
    );
  }
  if (error) {
    return (
      <main className="min-h-screen bg-[#0c0e13] p-8 text-white">
        <p className="text-red-400">{error}</p>
        <Link to="/explore" className="mt-4 inline-block text-lime-400">
          Back to Explore
        </Link>
      </main>
    );
  }
  if (!game) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0c0e13] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/explore"
          className="mb-8 inline-block text-sm text-lime-400 transition hover:text-lime-300"
        >
          ← Back to Explore
        </Link>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#171a22]">
          {game.background_image && (
            <img
              src={game.background_image}
              alt={`${game.name} artwork`}
              className="h-64 w-full object-cover sm:h-96"
            />
          )}

          <div className="p-6 sm:p-8">
            <p className="mb-3 text-sm font-medium text-lime-400">
              {game.released || "Release date unknown"}
            </p>

            <h1 className="text-3xl font-bold sm:text-5xl">{game.name}</h1>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-300">
              <p>
                <span className="text-yellow-400">★</span>{" "}
                {typeof game.rating === "number"
                  ? game.rating.toFixed(1)
                  : "Not rated"}
              </p>

              {game.metacritic != null && <p>Metacritic: {game.metacritic}</p>}
              {game.genres?.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-xl font-semibold">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {game.genres.map((genres) => (
                      <span
                        key={genres.id}
                        className="rounded-lg border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-sm text-lime-300"
                      >
                        {genres.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                {game.developers?.length > 0 && (
                  <section>
                    <h2 className="mb-3 text-lg font-semibold text-white">
                      Developers
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {game.developers.map((dev) => (
                        <span
                          key={dev.id}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                        >
                          {dev.name}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
                {game.publishers?.length > 0 && (
                  <section className="mt-5">
                    <h2 className="mb-3 text-lg font-semibold text-white">
                      Publishers
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {game.publishers.map((pub) => (
                        <span
                          key={pub.id}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                        >
                          {pub.name}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            {game.description_raw && (
              <section className="mt-8">
                <h2 className="mb-3 text-xl font-semibold">About this game</h2>
                <p className="whitespace-pre-line leading-7 text-gray-400">
                  {game.description_raw}
                </p>
              </section>
            )}

            {game.platforms?.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 text-xl font-semibold">
                  Available platforms
                </h2>

                <div className="flex flex-wrap gap-2">
                  {game.platforms.map(({ platform }) => (
                    <span
                      key={platform.id}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {screenshots.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-5 text-xl font-semibold text-white">
                  Screenshots
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {screenshots.map((img) => (
                    <div
                      key={img.id}
                      className="overflow-hidden rounded-xl border border-white/10 bg-[#171a22]"
                    >
                      <img
                        onClick={() => setSelectedScreenshot(img)}
                        src={img.image}
                        alt={`${game.name} screenshot`}
                        loading="lazy"
                        className="aspect-video w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {screenshotError && (
              <p className="mt-4 text-sm text-red-400">
                Could not load screenshots: {screenshotError}
              </p>
            )}

            {selectedScreenshot && (
              <div
                onClick={() => setSelectedScreenshot(null)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              >
                <div
                  onClick={(event) => event.stopPropagation()}
                  className="relative w-full max-w-5xl rounded-xl bg-[#171a22] p-4"
                >
                  <button
                    onClick={() => setSelectedScreenshot(null)}
                    className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black"
                    aria-label="Close screenshot"
                  >
                    ✕
                  </button>
                  <img
                    src={selectedScreenshot.image}
                    alt={`${game.name} screenshot`}
                    className="max-h-[80vh] w-full rounded-lg object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default GameDetailsPage;
