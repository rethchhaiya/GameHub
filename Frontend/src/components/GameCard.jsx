import { Link } from "react-router-dom";

function GameCard({ game }) {
  return (
    <Link
    to={`/game/${game.id}`}
      className="group overflow-hidden rounded-xl border border-white/10 bg-[#171a22] transition duration-200 hover:-translate-y-1 hover:border-lime-400/40 hover:shadow-xl hover:shadow-black/20"
    >
      {/* Game image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#222630]">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={`${game.name} artwork`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image available
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/70 px-2.5 py-1.5 text-sm font-semibold backdrop-blur-sm">
          <span className="mr-1 text-lime-400">★</span>
          {typeof game.rating === "number" ? game.rating.toFixed(1) : "N/A"}
        </div>
      </div>

      {/* Game information */}
      <div className="p-4">
        <p className="mb-2 text-xs font-medium text-lime-400">
          {game.released ? game.released.slice(0, 4) : "Release date unknown"}
        </p>

        <h3 className="text-base font-semibold leading-6 text-gray-100 transition group-hover:text-lime-300">
          {game.name}
        </h3>

        <p className="mt-2 truncate text-xs text-gray-500">{game.slug}</p>
      </div>
    </Link>
  );
}

export default GameCard;
