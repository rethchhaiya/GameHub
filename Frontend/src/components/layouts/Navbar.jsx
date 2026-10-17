import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/home");
  }

  const linkClasses = ({ isActive }) => {
    return isActive ? "text-lime-400" : "text-gray-300 hover:text-white";
  };

  return (
    <nav className="bg-[#0c0e13] sticky top-0 z-10 border-b border-white/10">
      <div className="flex justify-between md:px-10 md:py-5 px-3 py-5">
        <Link to={"/home"} className="text-2xl text-white font-bold">
          Game<span className="text-lime-400">Hub</span>
        </Link>
        <div className="md:flex gap-5 hidden">
          <NavLink className={linkClasses} to={"/home"}>
            Home
          </NavLink>
          <NavLink to={"/explore"} className={linkClasses}>
            Explore
          </NavLink>
          <NavLink to={"/library"} className={linkClasses}>
            MyLibrary
          </NavLink>
          <NavLink to={"/community"} className={linkClasses}>
            Community
          </NavLink>
        </div>
        <div className="gap-2 text-[15px] md:flex hidden">
          {user ? (
            <>
              <span className="text-gray-300 tex px-3 font-bold flex items-center">
                Hi, {user.userName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-[5px] border border-white/10 px-3 py-1 font-bold text-gray-300 hover:border-white/30"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to={"/login"}
                className=" p-1 rounded-[5px] text-gray-300 px-3 font-bold hover:text-gray-700"
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className="text-black bg-lime-400 rounded-[5px] px-3 font-bold hover:bg-lime-300 hover:text-black/90 flex items-center"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden flex h-10 w-10 items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 p-5 border-t border-white/10">
          <NavLink
            onClick={() => setMenuOpen(false)}
            className={linkClasses}
            to={"/home"}
          >
            Home
          </NavLink>
          <NavLink
            to={"/explore"}
            onClick={() => setMenuOpen(false)}
            className={linkClasses}
          >
            Explore
          </NavLink>
          <NavLink
            to={"/library"}
            onClick={() => setMenuOpen(false)}
            className={linkClasses}
          >
            MyLibrary
          </NavLink>
          <NavLink
            to={"/community"}
            onClick={() => setMenuOpen(false)}
            className={linkClasses}
          >
            Community
          </NavLink>

          {user ? (
            <>
              <span className="text-center text-gray-300 font-bold">
                hi,{user.userName}
              </span>
              <button
              onClick={handleLogout}
              className="rounded-[5px] border border-white/10 px-3 py-2 font-bold text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to={"/login"}
                onClick={() => setMenuOpen(false)}
                className=" p-1 rounded-[5px] text-gray-300 px-3 font-bold hover:text-gray-700 flex justify-center"
              >
                Login
              </Link>
              <Link
                to={"/register"}
                onClick={() => setMenuOpen(false)}
                className="text-black bg-lime-400 rounded-[5px] px-3 py-2 font-bold hover:bg-lime-300 hover:text-black/90 flex justify-center"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
