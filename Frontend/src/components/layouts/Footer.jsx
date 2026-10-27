import { Link } from "react-router-dom";

const browseLinks = [
  { to: "/explore", label: "Explore games" },
  { to: "/community", label: "Community" },
];

const accountLinks = [
  { to: "/library", label: "My library" },
  { to: "/profile", label: "Profile" },
];

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link
              to="/home"
              className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-lime-400/30 bg-lime-400/10 text-sm text-lime-300">
                G
              </span>
              <span>
                Game<span className="text-lime-400">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-mist-500">
              Discover games, track what you play, and share your takes with a
              community of players.
            </p>
          </div>

          <div className="flex gap-14 text-sm sm:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist-600">
                Browse
              </p>
              <ul className="mt-4 space-y-2.5">
                {browseLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-mist-400 transition hover:text-lime-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist-600">
                Account
              </p>
              <ul className="mt-4 space-y-2.5">
                {accountLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-mist-400 transition hover:text-lime-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-mist-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} GameHub. All rights reserved.</span>
          <span>Game data by RAWG</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
