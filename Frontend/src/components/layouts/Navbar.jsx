import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        </div>
      )}
    </nav>
  );
}

export default Navbar;
