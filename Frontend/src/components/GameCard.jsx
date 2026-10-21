import { Link } from "react-router-dom";

function GameCard({ game }) {
  const releaseYear = game.released ? game.released.slice(0, 4) : null;
  const genres = (game.genres ?? []).slice(0, 2);

  return (
    <Link
      to={`/game/${game.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#171a22] transition duration-200 hover:-translate-y-1 hover:border-lime-400/40 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Artwork */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#222630]">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={`${game.name} artwork`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image available
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#171a22] via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-lg border border-white/10 bg-black/70 px-2.5 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <span className="mr-1 text-lime-400">★</span>
            {typeof game.rating === "number" ? game.rating.toFixed(1) : "N/A"}
          </span>

          {game.metacritic != null && (
            <span className="rounded-lg border border-white/10 bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-gray-300 backdrop-blur-sm">
              MC {game.metacritic}
            </span>
          )}
        </div>

        <span className="absolute bottom-3 right-3 translate-y-2 rounded-lg bg-lime-400 px-3 py-1.5 text-xs font-bold text-gray-950 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          View details
        </span>
      </div>

      {/* Information */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-lime-400">
            {releaseYear || "Release date unknown"}
          </p>

          {game.ratings_count > 0 && (
            <p className="text-xs text-gray-500">
              {game.ratings_count.toLocaleString()} ratings
            </p>
          )}
        </div>

        <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-gray-100 transition group-hover:text-lime-300">
          {game.name}
        </h3>

        {genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-gray-400"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default GameCard;
