import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getReviewByGame,
  createReview,
  updateReview,
  deleteReview,
} from "../../services/reviewService";

function ReviewSection({ rawgId }) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!rawgId) return;

    const fetchReviews = async () => {
      try {
        const data = await getReviewByGame(rawgId);
        setReviews(data);
      } catch (err) {
        setError(
          err.status === 401
            ? "Your session expired — log in again to see reviews."
            : err.message || "Could not load reviews.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [rawgId]);

  const resetForm = () => {
    setRating(5);
    setContent("");
    setEditingId(null);
    setFormError(null);
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setContent(review.content);
    setFormError(null);
    window.scrollTo({ top: document.body.scrollHeight });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      setFormError("Write something first — the review cannot be empty.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      if (editingId) {
        const updated = await updateReview(editingId, {
          rating: Number(rating),
          content,
        });
        setReviews(reviews.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const created = await createReview({
          rawgId,
          rating: Number(rating),
          content,
        });
        setReviews([created, ...reviews]);
      }
      resetForm();
    } catch (err) {
      if (err.status === 409) {
        setFormError("You already reviewed this game");
      } else if (err.status === 400 && err.fieldErrors) {
        const messages = Object.values(err.fieldErrors).join(", ");
        setFormError(messages || "Check your rating and content.");
      } else {
        setFormError(err.message || "Something went wrong. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    setBusyId(reviewId);
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch {
      setError("Could not delete the review. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <section className="rounded-xl border border-white/10 bg-[#171a22] p-6">
        <h2 className="text-lg font-semibold text-gray-100">Reviews</h2>
        <p className="mt-2 text-sm text-gray-500">Loading reviews…</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/10 bg-[#171a22] p-6">
      <h2 className="text-lg font-semibold text-gray-100">
        Reviews ({reviews.length})
      </h2>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {reviews.length === 0 && !error && (
        <p className="mt-4 text-sm text-gray-500">
          No reviews yet — be the first one to write one.
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-gray-200">
                  {review.userName || `User #${review.userId}`}
                </p>
                <p className="text-xs text-gray-500">
                  {review.rating} / 5 ·{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              {user && review.userId === user.id && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(review)}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-gray-300 hover:text-lime-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    disabled={busyId === review.id}
                    className="rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-300 disabled:opacity-50"
                  >
                    {busyId === review.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              )}
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-300">
              {review.content}
            </p>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <p className="text-sm font-medium text-gray-200">
            {editingId ? "Edit your review" : "Write a review"}
          </p>

          <label className="block text-xs text-gray-500" htmlFor="review-rating">
            Rating
          </label>
          <select
            id="review-rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-24 rounded-md border border-white/10 bg-[#222630] px-2 py-1.5 text-sm text-gray-200"
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="What did you think of this game?"
            className="w-full rounded-lg border border-white/10 bg-[#222630] px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:border-lime-400/50 focus:outline-none"
          />

          {formError && (
            <p className="text-sm text-red-400">{formError}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-bold text-gray-950 transition hover:bg-lime-300 disabled:opacity-50"
            >
              {submitting
                ? "Saving…"
                : editingId
                  ? "Save changes"
                  : "Post review"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="mt-6 text-sm text-gray-500">
          <Link
            to="/login"
            className="font-medium text-lime-400 hover:text-lime-300"
          >
            Log in
          </Link>{" "}
          to leave a review.
        </p>
      )}
    </section>
  );
}

export default ReviewSection;
