function Avatar({ name, src, className = "h-10 w-10 text-sm" }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`shrink-0 rounded-full object-cover ring-1 ring-white/10 ${className}`}
      />
    );
  }

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-linear-to-br from-lime-400/30 to-white/5 font-bold text-lime-200 ring-1 ring-white/10 ${className}`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export default Avatar;
