import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createPost } from "../services/communityService";
import Avatar from "./Avatar";

const MAX_LENGTH = 2000;

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function PostComposer({ onCreated }) {
  const { user, loading } = useAuth();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div
        className="h-32 animate-pulse rounded-2xl border border-white/10 bg-ink-850"
        aria-hidden="true"
      />
    );
  }

  if (!user) {
    return (
      <section className="rounded-2xl border border-white/10 bg-ink-850 p-6">
        <h2 className="font-display text-lg font-semibold text-white">
          Join the conversation
        </h2>
        <p className="mt-1 text-sm leading-6 text-mist-400">
          Log in to share a post and like what other players are saying.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/login"
            className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-bold text-ink-950 transition hover:bg-lime-300"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-mist-100 transition hover:border-white/30 hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </section>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = content.trim();

    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const post = await createPost(trimmed, imageUrl.trim() || null);
      setContent("");
      setImageUrl("");
      setShowImage(false);
      onCreated?.(post);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const displayName = user.userName || "You";
  const nearLimit = content.length > MAX_LENGTH - 100;

  return (
    <section className="rounded-2xl border border-white/10 bg-ink-850 p-4 sm:p-5">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Avatar name={displayName} />

          <div className="min-w-0 flex-1">
            <label htmlFor="post-content" className="sr-only">
              Write a post
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={3}
              maxLength={MAX_LENGTH}
              placeholder="What are you playing?"
              className="w-full resize-none bg-transparent text-[15px] leading-7 text-mist-100 outline-none placeholder:text-mist-600"
            />

            {showImage && (
              <div className="mt-1">
                <label htmlFor="post-image-url" className="sr-only">
                  Image URL
                </label>
                <input
                  id="post-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="Paste an image URL"
                  className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none transition placeholder:text-mist-600 focus:border-lime-400/60"
                />
              </div>
            )}

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowImage((open) => !open)}
                  aria-expanded={showImage}
                  aria-controls="post-image-url"
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    showImage
                      ? "bg-lime-400/10 text-lime-300"
                      : "text-mist-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <ImageIcon />
                  Image
                </button>

                {content.length > 0 && (
                  <span
                    className={`text-xs ${
                      nearLimit ? "text-amber-300" : "text-mist-600"
                    }`}
                  >
                    {content.length}/{MAX_LENGTH}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!content.trim() || submitting}
                className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-bold text-ink-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
          >
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

export default PostComposer;
