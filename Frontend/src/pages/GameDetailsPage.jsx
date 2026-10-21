import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchGameById, fetchGameScreenshots } from "../services/gameService";
import { addToLibrary } from "../services/libraryService";
import { LIBRARY_STATUS_OPTIONS } from "../constants/libraryStatuses";
import { useAuth } from "../hooks/useAuth";

const chipClass =
  "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300";

const tagClass =
  "rounded-lg border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-sm text-lime-300";

function InfoCard({ title, children }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#171a22] p-5">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

function GameDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [screenshots, setScreenshots] = useState([]);
  const [screenshotError, setScreenshotError] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [addStatus, setAddStatus] = useState("PLAN_TO_PLAY");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState("");

  async function handleAddToLibrary() {
    setAdding(true);
    setAddError("");
    try {
      await addToLibrary({
        rawgId: game.id,
        gameName: game.name,
        gameImage: game.background_image,
        status: addStatus,
      });
      setAdded(true);
    } catch (e) {
      setAddError(
        e.status === 409
          ? "This game is already in your library."
          : e.message,
      );
    } finally {
      setAdding(false);
    }
  }

  useEffect(() => {
    async function loadGame() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchGameById(id);
        setGame(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [id]);

  useEffect(() => {
    async function loadScreenshots() {
      try {
        const result = await fetchGameScreenshots(id);
        setScreenshots(result.results ?? []);
      } catch (e) {
        setScreenshotError(e.message);
      }
    }
    loadScreenshots();
  }, [id]);

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((index) => (index + 1) % screenshots.length);
      }
      if (event.key === "ArrowLeft") {
        setSelectedIndex(
          (index) => (index - 1 + screenshots.length) % screenshots.length,
        );
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, screenshots.length]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0e13] px-5 py-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-4 w-32 rounded bg-white/10" />
          <div className="h-85 rounded-2xl bg-white/5 sm:h-110" />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="h-4 w-40 rounded bg-white/10" />
              <div className="h-3 w-full rounded bg-white/5" />
              <div className="h-3 w-5/6 rounded bg-white/5" />
              <div className="h-3 w-4/6 rounded bg-white/5" />
            </div>
            <div className="h-48 rounded-xl bg-white/5" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0c0e13] px-5 py-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </p>
          <Link
            to="/explore"
            className="mt-6 inline-block text-sm text-lime-400 transition hover:text-lime-300"
          >
            ← Back to Explore
          </Link>
        </div>
      </main>
    );
  }

  if (!game) return null;

  const selectedScreenshot =
    selectedIndex === null ? null : screenshots[selectedIndex];

  return (
    <main className="min-h-screen bg-[#0c0e13] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/explore"
          className="mb-6 inline-block text-sm text-lime-400 transition hover:text-lime-300"
        >
          ← Back to Explore
        </Link>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#171a22]">
          {game.background_image ? (
            <img
              src={game.background_image}
              alt={`${game.name} artwork`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#222630]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e13] via-[#0c0e13]/70 to-[#0c0e13]/20" />

          <div className="relative flex min-h-[360px] flex-col justify-end p-6 sm:min-h-[460px] sm:p-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
              {game.released || "Release date unknown"}
            </p>

            <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
              {game.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                <span className="mr-1 text-yellow-400">★</span>
                {typeof game.rating === "number"
                  ? game.rating.toFixed(1)
                  : "Not rated"}
              </span>

              {game.metacritic != null && (
                <span className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  Metacritic{" "}
                  <span className="font-semibold text-lime-300">
                    {game.metacritic}
                  </span>
                </span>
              )}

              {game.genres?.slice(0, 3).map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {game.description_raw && (
              <section>
                <h2 className="mb-3 text-xl font-semibold sm:text-2xl">
                  About this game
                </h2>
                <p className="whitespace-pre-line leading-7 text-gray-400">
                  {game.description_raw}
                </p>
              </section>
            )}

            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold sm:text-2xl">
                  Screenshots
                </h2>

                {screenshots.length > 0 && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                    {screenshots.length}
                  </span>
                )}
              </div>

              {screenshotError && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  Could not load screenshots: {screenshotError}
                </p>
              )}

              {!screenshotError && screenshots.length === 0 && (
                <p className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-gray-500">
                  No screenshots available for this game.
                </p>
              )}

              {screenshots.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {screenshots.map((screenshot, index) => (
                    <button
                      key={screenshot.id}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      aria-label={`Open screenshot ${index + 1} of ${screenshots.length}`}
                      className="group relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-[#171a22]"
                    >
                      <img
                        src={screenshot.image}
                        alt={`${game.name} screenshot ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <InfoCard title="Your library">
              {!user ? (
                <p className="text-sm text-gray-400">
                  <Link
                    to="/login"
                    className="font-medium text-lime-400 hover:text-lime-300"
                  >
                    Sign in
                  </Link>{" "}
                  to add this game to your library.
                </p>
              ) : added ? (
                <>
                  <p className="text-sm text-lime-300">
                    Added to your library.
                  </p>
                  <Link
                    to="/library"
                    className="mt-4 inline-block rounded-lg bg-lime-400 px-4 py-2 text-sm font-bold text-gray-950 transition hover:bg-lime-300"
                  >
                    Open library
                  </Link>
                </>
              ) : (
                <>
                  <label
                    htmlFor="add-status"
                    className="mb-1 block text-sm text-gray-400"
                  >
                    Status
                  </label>

                  <select
                    id="add-status"
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value)}
                    disabled={adding}
                    className="w-full rounded-lg border border-white/10 bg-[#0c0e13] px-1 py-2 text-sm text-white outline-none focus:border-lime-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {LIBRARY_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAddToLibrary}
                    disabled={adding}
                    className="mt-4 w-full rounded-lg bg-lime-400 px-4 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {adding ? "Adding..." : "Add to library"}
                  </button>

                  {addError && (
                    <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-300">
                      {addError}
                    </p>
                  )}
                </>
              )}
            </InfoCard>

            {game.genres?.length > 0 && (
              <InfoCard title="Genres">
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span key={genre.id} className={tagClass}>
                      {genre.name}
                    </span>
                  ))}
                </div>
              </InfoCard>
            )}

            {game.platforms?.length > 0 && (
              <InfoCard title="Platforms">
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map(({ platform }) => (
                    <span key={platform.id} className={chipClass}>
                      {platform.name}
                    </span>
                  ))}
                </div>
              </InfoCard>
            )}

            {game.developers?.length > 0 && (
              <InfoCard title="Developers">
                <ul className="space-y-1.5 text-sm text-gray-300">
                  {game.developers.map((developer) => (
                    <li key={developer.id}>{developer.name}</li>
                  ))}
                </ul>
              </InfoCard>
            )}

            {game.publishers?.length > 0 && (
              <InfoCard title="Publishers">
                <ul className="space-y-1.5 text-sm text-gray-300">
                  {game.publishers.map((publisher) => (
                    <li key={publisher.id}>{publisher.name}</li>
                  ))}
                </ul>
              </InfoCard>
            )}
          </aside>
        </div>
      </div>

      {/* Screenshot lightbox */}
      {selectedScreenshot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot viewer"
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close screenshot"
            className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-2.5 text-white transition hover:bg-black"
          >
            ✕
          </button>

          {screenshots.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedIndex(
                    (index) =>
                      (index - 1 + screenshots.length) % screenshots.length,
                  );
                }}
                aria-label="Previous screenshot"
                className="absolute left-4 z-10 rounded-full bg-black/70 p-3 text-2xl leading-none text-white transition hover:bg-black"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedIndex(
                    (index) => (index + 1) % screenshots.length,
                  );
                }}
                aria-label="Next screenshot"
                className="absolute right-4 z-10 rounded-full bg-black/70 p-3 text-2xl leading-none text-white transition hover:bg-black"
              >
                ›
              </button>
            </>
          )}

          <figure
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-5xl"
          >
            <img
              src={selectedScreenshot.image}
              alt={`${game.name} screenshot ${selectedIndex + 1}`}
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />

            <figcaption className="mt-3 text-center text-sm text-gray-400">
              {selectedIndex + 1} / {screenshots.length}
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}

export default GameDetailsPage;
