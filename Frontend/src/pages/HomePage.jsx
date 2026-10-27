import { Link } from "react-router-dom";

const primaryButton =
  "inline-flex items-center justify-center rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-ink-950 transition hover:bg-lime-300";

const secondaryButton =
  "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-mist-100 transition hover:border-white/30 hover:bg-white/10";

const highlights = [
  "Powered by the RAWG catalog",
  "Four library statuses",
  "Reviews, likes & comments",
];

const features = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore the RAWG catalog with search, ratings, screenshots, and detailed game pages.",
    to: "/explore",
    cta: "Explore games",
  },
  {
    number: "02",
    title: "Library",
    description:
      "Track every game as playing, completed, planned, or dropped — your backlog stays in order.",
    to: "/library",
    cta: "Open library",
  },
  {
    number: "03",
    title: "Community",
    description:
      "Share reviews and posts, then react and comment on what other players are saying.",
    to: "/community",
    cta: "Join the community",
  },
];

const previewGames = [
  { title: "Elden Ring", meta: "Action RPG · 2022", status: "Playing" },
  { title: "Hades", meta: "Roguelike · 2020", status: "Completed" },
  { title: "Hollow Knight: Silksong", meta: "Metroidvania", status: "Plan to play" },
];

function statusClasses(status) {
  if (status === "Playing") {
    return "border-lime-400/30 bg-lime-400/10 text-lime-300";
  }

  if (status === "Completed") {
    return "border-white/10 bg-white/10 text-mist-300";
  }

  return "border-white/10 bg-white/5 text-mist-400";
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 text-lime-400"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-lime-400/[0.08] blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-lime-400/40 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pb-28 lg:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-mist-300">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              Game discovery, tracking & community
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your gaming life,
              <br />
              <span className="text-lime-400">in one place.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-mist-400 sm:text-lg sm:leading-8">
              Discover games, keep a personal library, and share reviews with
              other gamers — all from one clean hub.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/explore" className={primaryButton}>
                Explore games
              </Link>
              <Link to="/community" className={secondaryButton}>
                Join the community
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-mist-400">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            aria-hidden="true"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-lime-400/[0.06] blur-2xl" />

            <div className="relative rounded-2xl border border-white/10 bg-ink-850 p-5 shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                  Library preview
                </p>
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {previewGames.map((game) => (
                  <div
                    key={game.title}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-900 p-3"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-linear-to-br from-lime-400/25 to-transparent font-display text-sm font-bold text-lime-200">
                      {game.title.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-mist-100">
                        {game.title}
                      </p>
                      <p className="truncate text-xs text-mist-500">
                        {game.meta}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClasses(
                        game.status,
                      )}`}
                    >
                      {game.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-ink-900 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-mist-500">Collection progress</span>
                  <span className="font-semibold text-lime-300">68%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-lime-400" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 rounded-xl border border-white/10 bg-ink-800 px-4 py-3 shadow-xl shadow-black/50 sm:-left-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mist-500">
                Avg. rating
              </p>
              <p className="mt-1 font-display text-lg font-bold text-white">
                <span className="text-lime-400">★</span> 4.6
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-ink-900">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lime-400">
              Built for players
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              One hub for everything you play.
            </h2>
            <p className="mt-3 text-sm leading-6 text-mist-400 sm:text-base">
              Three connected pieces that turn browsing into a collection — and
              a collection into a conversation.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.to}
                to={feature.to}
                className="group flex flex-col rounded-2xl border border-white/10 bg-ink-850 p-6 transition hover:border-lime-400/40 hover:bg-ink-800"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-semibold tracking-[0.2em] text-mist-600">
                    {feature.number}
                  </span>
                  <span
                    className="text-mist-600 transition group-hover:translate-x-0.5 group-hover:text-lime-300"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>

                <h3 className="mt-6 font-display text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-mist-400">
                  {feature.description}
                </p>
                <span className="mt-6 text-sm font-semibold text-lime-300">
                  {feature.cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="relative overflow-hidden rounded-2xl border border-lime-400/20 bg-linear-to-br from-lime-400/10 via-ink-850 to-ink-900 px-6 py-10 sm:px-10 sm:py-12">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-lime-400/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Start your collection tonight.
              </h2>
              <p className="mt-2 text-sm leading-6 text-mist-400">
                Create a free account to save games, publish reviews, and join
                the conversation.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/register" className={primaryButton}>
                Create account
              </Link>
              <Link to="/explore" className={secondaryButton}>
                Browse games
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
