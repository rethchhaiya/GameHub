function Footer() {
  return (
    <footer className="border-t border-white/10 text-gray-500 px-10 py-5">
      <div className="sm:flex-row sm:justify-between flex flex-col items-center gap-2">
        <span>© {new Date().getFullYear()} GameHub </span>
        <span>Game data by RAWG</span>
      </div>
    </footer>
  );
}

export default Footer;
