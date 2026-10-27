import { Link } from "react-router-dom";
import Feed from "../components/Feed";

const rules = [
  "Keep it about games.",
  "Be decent to other players.",
  "No spam or wall-to-wall self-promo.",
];

const quickLinks = [
  { to: "/explore", label: "Find a game" },
  { to: "/library", label: "Open your library" },
  { to: "/profile", label: "Edit your profile" },
];

function CommunityPage() {
  return (
    <main className="min-h-screen bg-ink-950 px-5 py-10 text-mist-100 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
            GameHub / Community
          </p>

          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The lobby is <span className="text-lime-400">open.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-mist-400 sm:text-base">
            Share what you're playing, react to other players, and keep the
            conversation going.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Feed />

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <section className="rounded-2xl border border-white/10 bg-ink-850 p-5">
                <h2 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-mist-300">
                  House rules
                </h2>

                <ul className="mt-4 space-y-3">
                  {rules.map((rule) => (
                    <li
                      key={rule}
                      className="flex gap-2.5 text-sm leading-6 text-mist-400"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-400" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-white/10 bg-ink-850 p-5">
                <h2 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-mist-300">
                  Quick links
                </h2>

                <ul className="mt-3 space-y-1">
                  {quickLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-mist-400 transition hover:bg-white/5 hover:text-lime-300"
                      >
                        {link.label}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </aside>
        </div>

        <div className="mt-8 lg:hidden">
          <section className="rounded-2xl border border-white/10 bg-ink-850 p-5">
            <h2 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-mist-300">
              House rules
            </h2>

            <ul className="mt-4 space-y-3">
              {rules.map((rule) => (
                <li
                  key={rule}
                  className="flex gap-2.5 text-sm leading-6 text-mist-400"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-400" />
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CommunityPage;
