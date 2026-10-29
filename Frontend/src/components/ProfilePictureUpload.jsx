import { useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

function ProfilePictureUpload({
  value = "",
  name = "",
  file = null,
  onSelect = () => {},
  onClear = () => {},
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState({ file: null, url: "" });
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  const src = file && preview.file === file ? preview.url : value;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  function handleFile(selected) {
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError("");
    setPreview({ file: selected, url: URL.createObjectURL(selected) });
    onSelect(selected);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleChange(event) {
    handleFile(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFile(event.dataTransfer.files?.[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    if (!disabled) setDragging(true);
  }

  function handleRemove() {
    setError("");
    setPreview({ file: null, url: "" });
    onClear();
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <input
        ref={inputRef}
        id="profile-picture"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        disabled={disabled}
        aria-label={src ? "Change profile picture" : "Upload profile picture"}
        className={`group relative h-28 w-28 overflow-hidden rounded-full border bg-ink-900 transition ${
          dragging
            ? "border-lime-400 ring-4 ring-lime-400/20"
            : "border-white/15 ring-1 ring-white/5 hover:border-lime-400/60"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {src ? (
          <img
            src={src}
            alt="Profile picture preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center text-3xl font-bold text-lime-400"
            aria-hidden="true"
          >
            {initial}
          </span>
        )}

        <span
          className={`absolute inset-0 grid place-items-center bg-ink-950/70 px-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-mist-100 transition-opacity ${
            disabled || dragging
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          }`}
        >
          {disabled ? "Saving…" : dragging ? "Drop image" : "Change photo"}
        </span>
      </button>

      <div className="flex items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="font-semibold text-lime-300 transition hover:text-lime-200 disabled:opacity-50"
        >
          {src ? "Replace" : "Upload photo"}
        </button>
        {src && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="text-mist-500 transition hover:text-red-300 disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>

      {file && (
        <p className="text-center text-[0.7rem] font-semibold text-lime-300">
          Unsaved — press Save Profile to keep it.
        </p>
      )}

      {error && (
        <p role="alert" className="text-center text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default ProfilePictureUpload;
