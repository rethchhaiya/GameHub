import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  addComment,
  deleteComment,
  getComments,
} from "../services/communityService";
import { parseApiDate, timeAgo } from "../utils/time";
import Avatar from "./Avatar";

const PAGE_SIZE = 20;
const MAX_LENGTH = 500;

function mergeComments(existing, incoming) {
  const byId = new Map(existing.map((comment) => [comment.id, comment]));

  incoming.forEach((comment) => byId.set(comment.id, comment));

  return [...byId.values()].sort((a, b) => {
    const aTime = parseApiDate(a.createdAt)?.getTime() ?? 0;
    const bTime = parseApiDate(b.createdAt)?.getTime() ?? 0;

    return aTime - bTime || a.id - b.id;
  });
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3" aria-hidden="true">
      <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
      <div className="flex-1 animate-pulse space-y-2">
        <div className="h-2.5 w-28 rounded bg-white/10" />
        <div className="h-3 w-3/4 rounded bg-white/5" />
      </div>
    </div>
  );
}

function CommentsSection({
  postId,
  postOwnerId,
  initialTotal = 0,
  onTotalChange,
}) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getComments(postId, 0, PAGE_SIZE)
      .then((data) => {
        if (cancelled) return;

        const fetched = data.content ?? [];
        const nextTotal = data.totalElements ?? fetched.length;

        setComments(fetched);
        setTotal(nextTotal);
        setPage(data.number ?? 0);
        setLast(Boolean(data.last));
        setError("");
        onTotalChange?.(nextTotal);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [postId, retryKey, onTotalChange]);

  function retry() {
    setLoading(true);
    setError("");
    setRetryKey((key) => key + 1);
  }

  async function handleLoadMore() {
    if (loadingMore || last) return;

    setLoadingMore(true);
    setError("");

    try {
      const data = await getComments(postId, page + 1, PAGE_SIZE);
      const incoming = data.content ?? [];

      setComments((prev) => mergeComments(prev, incoming));
      setPage(data.number ?? page + 1);
      setLast(Boolean(data.last));

      if (typeof data.totalElements === "number") {
        setTotal(data.totalElements);
        onTotalChange?.(data.totalElements);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = draft.trim();

    if (!trimmed || submitting || !user) return;

    setSubmitting(true);
    setFormError("");

    try {
      const created = await addComment(postId, trimmed);

      setComments((prev) => mergeComments(prev, [created]));

      const nextTotal = total + 1;
      setTotal(nextTotal);
      onTotalChange?.(nextTotal);
      setDraft("");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(comment) {
    if (deletingId) return;

    setDeletingId(comment.id);
    setFormError("");

    try {
      await deleteComment(comment.id);

      setComments((prev) => prev.filter((item) => item.id !== comment.id));

      const nextTotal = Math.max(0, total - 1);
      setTotal(nextTotal);
      onTotalChange?.(nextTotal);
      setConfirmingId(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  function canDelete(comment) {
    return Boolean(
      user && (user.id === comment.userId || user.id === postOwnerId),
    );
  }

  return (
    <section
      id={`comments-${postId}`}
      className="border-t border-white/10 bg-ink-900/50 px-5 py-4"
    >
      {loading && (
        <div className="space-y-4">
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          <span>{error}</span>
          <button
            type="button"
            onClick={retry}
            className="shrink-0 font-semibold text-red-200 transition hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="py-2 text-sm text-mist-500">
          No comments yet. Start the thread.
        </p>
      )}

      {comments.length > 0 && (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <Avatar
                name={comment.username}
                className="h-8 w-8 text-xs"
              />

              <div className="min-w-0 flex-1">
                <div className="rounded-xl bg-white/5 px-3 py-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs font-semibold text-mist-200">
                      {comment.username || "Player"}
                    </span>

                    {comment.createdAt && (
                      <time
                        dateTime={comment.createdAt}
                        className="text-[11px] text-mist-600"
                      >
                        {timeAgo(comment.createdAt)}
                      </time>
                    )}

                    {canDelete(comment) && (
                      <span className="ml-auto flex items-center gap-1.5 text-[11px]">
                        {confirmingId === comment.id ? (
                          <>
                            <span className="text-red-300">Delete?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(comment)}
                              disabled={deletingId === comment.id}
                              className="font-semibold text-red-300 transition hover:text-red-200 disabled:opacity-50"
                            >
                              {deletingId === comment.id ? "…" : "Yes"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingId(null)}
                              className="text-mist-500 transition hover:text-mist-300"
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmingId(comment.id)}
                            className="text-mist-600 transition hover:text-red-300"
                          >
                            Delete
                          </button>
                        )}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-mist-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!last && !loading && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="mt-4 text-xs font-semibold text-lime-300 transition hover:text-lime-200 disabled:opacity-50"
        >
          {loadingMore ? "Loading…" : "Load more comments"}
        </button>
      )}

      {formError && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
        >
          {formError}
        </p>
      )}

      <div className="mt-4 border-t border-white/10 pt-4">
        {user ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Avatar
              name={user.userName}
              className="hidden h-8 w-8 text-xs sm:grid"
            />

            <label htmlFor={`comment-input-${postId}`} className="sr-only">
              Write a comment
            </label>
            <input
              id={`comment-input-${postId}`}
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={MAX_LENGTH}
              placeholder="Write a comment…"
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none transition placeholder:text-mist-600 focus:border-lime-400/60"
            />

            <button
              type="submit"
              disabled={!draft.trim() || submitting || loading}
              className="shrink-0 rounded-lg bg-lime-400 px-3 py-2 text-xs font-bold text-ink-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "…" : "Comment"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-mist-500">
            <Link
              to="/login"
              className="font-semibold text-lime-300 transition hover:text-lime-200"
            >
              Log in
            </Link>{" "}
            to join the conversation.
          </p>
        )}
      </div>
    </section>
  );
}

export default CommentsSection;
