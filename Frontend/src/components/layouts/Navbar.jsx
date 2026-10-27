import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/library", label: "Library" },
  { to: "/community", label: "Community" },
];

const desktopLinkClasses =
  "relative rounded-lg px-3 py-2 text-sm font-medium text-mist-400 transition hover:bg-white/5 hover:text-white aria-[current=page]:text-white after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-lime-400 after:opacity-0 after:transition-opacity aria-[current=page]:after:opacity-100";

const mobileLinkClasses =
  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-mist-300 transition hover:bg-white/5 hover:text-white aria-[current=page]:bg-lime-400/10 aria-[current=page]:text-lime-300 after:ml-auto after:h-1.5 after:w-1.5 after:rounded-full after:bg-lime-400 after:opacity-0 aria-[current=page]:after:opacity-100";

function BurgerIcon({ open }) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/home");
  }

  const initial = user?.userName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-ink-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          to="/home"
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-2.5 font-display text-xl font-bold tracking-tight text-white"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-lime-400/30 bg-lime-400/10 text-base font-bold text-lime-300 transition group-hover:border-lime-400/60 group-hover:bg-lime-400/15">
            G
          </span>
          <span>
            Game<span className="text-lime-400">Hub</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={desktopLinkClasses}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-lime-400 text-xs font-bold text-ink-950">
                  {initial}
                </span>
                <span className="max-w-40 truncate text-sm font-medium text-mist-300">
                  {user.userName}
                </span>
              </span>
              <NavLink
                to="/profile"
                className="rounded-lg px-3 py-2 text-sm font-medium text-mist-400 transition hover:bg-white/5 hover:text-white aria-[current=page]:text-white"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm font-semibold text-mist-300 transition hover:border-white/25 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-mist-300 transition hover:bg-white/5 hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-bold text-ink-950 transition hover:bg-lime-300"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-mist-300 transition hover:border-white/25 hover:text-white md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <BurgerIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-ink-900 px-4 pb-6 pt-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClasses}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-lime-400 text-sm font-bold text-ink-950">
                    {initial}
                  </span>
                  <span className="truncate text-sm font-medium text-mist-200">
                    {user.userName}
                  </span>
                </div>
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClasses}
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-mist-300 transition hover:border-white/25 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg border border-white/10 px-3 py-2.5 text-center text-sm font-semibold text-mist-200 transition hover:border-white/25 hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-lime-400 px-3 py-2.5 text-center text-sm font-bold text-ink-950 transition hover:bg-lime-300"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
