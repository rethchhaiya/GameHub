import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteFromLibrary,
  getLibrary,
  updateStatus,
} from "../services/libraryService";
import { LIBRARY_STATUS_OPTIONS } from "../constants/libraryStatuses";

function MyLibraryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    async function loadLibrary() {
      setLoading(true);
      setError("");
      try {
        const data = await getLibrary();
        setEntries(data);
      } catch (e) {
        setError(e.message);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
    loadLibrary();
  }, []);

  async function handleStatusChange(entryId, status) {
    setBusyId(entryId);
    setError("");
    setConfirmId(null);
    try {
      const updated = await updateStatus(entryId, status);
      setEntries((current) =>
        current.map((entry) => (entry.id === updated.id ? updated : entry)),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(entryId) {
    setBusyId(entryId);
    setError("");
    try {
      await deleteFromLibrary(entryId);
      setEntries((current) =>
        current.filter((entry) => entry.id !== entryId),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0c0e13] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
            GameHub / Library
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Your <span className="text-lime-400">collection.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
            Track what you are playing, what you finished, and what is next.
          </p>
        </header>

        {error && (
          <p className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-sm text-lime-300">Loading your library...</p>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#0c0e13] px-6 py-16 text-center">
            <p className="mb-3 text-4xl text-lime-400">▦</p>

            <h2 className="text-xl font-semibold">Your library is empty</h2>

            <p className="mt-2 text-sm text-gray-400">
              Find a game you like and add it to your collection.
            </p>

            <Link
              to="/explore"
              className="mt-6 inline-block rounded-lg bg-lime-400 px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-lime-300"
            >
              Browse games
            </Link>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold sm:text-2xl">All games</h2>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                {entries.length} {entries.length === 1 ? "game" : "games"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <article
                  key={entry.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#171a22]"
                >
                  <Link
                    to={`/game/${entry.rawgId}`}
                    className="group block aspect-16/10 overflow-hidden bg-[#222630]"
                  >
                    {entry.gameImage ? (
                      <img
                        src={entry.gameImage}
                        alt={`${entry.gameName} artwork`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No image available
                      </div>
                    )}
                  </Link>

                  <div className="p-4">
                    <Link
                      to={`/game/${entry.rawgId}`}
                      className="text-base font-semibold leading-6 text-gray-100 transition hover:text-lime-300"
                    >
                      {entry.gameName}
                    </Link>

                    <p className="mt-1 text-xs text-gray-500">
                      Added {new Date(entry.addedAt).toLocaleDateString()}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <select
                        value={entry.status}
                        onChange={(e) =>
                          handleStatusChange(entry.id, e.target.value)
                        }
                        disabled={busyId !== null}
                        aria-label={`Status for ${entry.gameName}`}
                        className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0c0e13] px-3 py-2 text-sm text-white outline-none focus:border-lime-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {LIBRARY_STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setConfirmId(entry.id)}
                        disabled={busyId !== null}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>

                    {confirmId === entry.id && (
                      <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                        <p className="text-xs text-gray-300">
                          Remove {entry.gameName} from your library?
                        </p>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id)}
                            disabled={busyId !== null}
                            className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {busyId === entry.id ? "Removing..." : "Yes, remove"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            disabled={busyId !== null}
                            className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default MyLibraryPage;
