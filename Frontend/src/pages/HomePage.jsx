import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="md:px-20 md:py-16 px-5 py-5">
      <p className="mb-4 text-xs font-bold uppercase text-lime-400 tracking-[0.25em]">
        GameHub
      </p>
      <div className="text-4xl sm:text-5xl flex flex-col font-bold">
        <h1 className="text-white">
          Your gaming life, <br />
          <span className="text-lime-400 tracking-[0.15em]">in one place</span>
        </h1>
      </div>
      <div className="mt-14 text-gray-400 max-w-xl text-2xl font-semibold ">
        <p>
          Discover games, keep a personal library, and share reviews with other
          gamers.
        </p>
      </div>

      <div className="mt-14">
        <Link
          to={"/explore"}
          className="bg-lime-400 px-6 py-3 rounded-xl text-black font-bold items-center inline-flex"
        >
          Explore games
        </Link>
      </div>

      <div className="border border-white/10 mt-20"></div>

      <div className="mt-20">
        <div className="grid md:grid-cols-3 w-full gap-3">
          <div className="rounded-xl border border-white/10 bg-[#171a22] p-6">
            <h2 className="text-lg font-semibold text-white">Discover</h2>
            <p className="mt-2 text-sm text-gray-400">
              Browse games from the RAWG catalog with search and detailed info.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#171a22] p-6">
            <h2 className="text-lg font-semibold text-white">Library</h2>
            <p className="mt-2 text-sm text-gray-400">
              Keep track of what you're playing, completed, or plan to play.
            </p>
            <span className="mt-3 inline-block rounded-full border border-lime-400/20 bg-lime-400/10 px-2 py-0.5 text-xs text-lime-300 items-center">
              Coming soon
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#171a22] p-6">
            <h2 className="text-lg font-semibold text-white">Community</h2>
            <p className="mt-2 text-sm text-gray-400">
              Share reviews, posts, and reactions with other gamers.
            </p>
            <span className="mt-3 inline-block rounded-full border border-lime-400/20 bg-lime-400/10 px-2 py-0.5 text-xs text-lime-300 items-center">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
