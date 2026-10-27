import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import { likePost, unLikePost } from "../services/communityService";
import { updateCachedPost } from "../utils/feedCache";
import { timeAgo } from "../utils/time";
import Avatar from "./Avatar";
import CommentsSection from "./CommentsSection";

const globalLikeQueue = new Map();
const globalTimeOuts = new Map();
const globalLikeState = new Map();

async function processPendingLike(postId, finalLiked, onSuccess, onError) {
  globalTimeOuts.delete(postId);
  globalLikeQueue.delete(postId);

  try {
    const data = finalLiked ? await likePost(postId) : await unLikePost(postId);

    if (data) {
      globalLikeState.set(postId, {
        liked: data.likedByCurrentUser,
        likeCount: data.likeCount,
      });

      onSuccess?.(data);
    }
  } catch (err) {
    console.error(`Cannot update post ${postId} to server`, err);
    onError?.(err);
  }
}

function flushQueueBeforeUnload() {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  globalLikeQueue.forEach((finalLiked, postId) => {
    fetch(`${baseUrl}/posts/${postId}/likes`, {
      method: finalLiked ? "POST" : "DELETE",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }).catch((err) => console.error("Error flushing queue", err));
  });
}

function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
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
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(() => {
    const cached = globalLikeState.get(post.id);
    return cached ? cached.liked : post.likedByCurrentUser;
  });
  const [likeCount, setLikeCount] = useState(() => {
    const cached = globalLikeState.get(post.id);
    return cached ? cached.likeCount : post.likeCount;
  });
  const [error, setError] = useState("");
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const navigate = useNavigate();

  const handleCommentTotal = useCallback(
    (nextTotal) => {
      setCommentCount(nextTotal);
      updateCachedPost(post.id, () => ({ commentCount: nextTotal }));
    },
    [post.id],
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      flushQueueBeforeUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  function handleLikeClick() {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const next = !liked;
    const nextCount = likeCount + (next ? 1 : -1);
    setLiked(next);
    setError("");

    globalLikeState.set(post.id, { liked: next, likeCount: nextCount });

    const postId = post.id;

    if (next === post.likedByCurrentUser) {
      if (globalTimeOuts.has(postId)) {
        clearTimeout(globalTimeOuts.get(postId));
        globalTimeOuts.delete(postId);
      }
      globalLikeQueue.delete(postId);
      return;
    }

    globalLikeQueue.set(postId, next);

    if (globalTimeOuts.has(postId)) {
      clearTimeout(globalTimeOuts.get(postId));
    }

    const timeoutId = setTimeout(() => {
      processPendingLike(
        postId,
        next,
        (data) => {
          setLiked(data.likedByCurrentUser);
          setLikeCount(data.likeCount);
        },
        () => {
          globalLikeState.delete(post.id);
          setLiked(post.likedByCurrentUser);
          setLikeCount(post.likeCount);
          setError("Couldn't update your like. Please try again.");
        },
      );
    }, 800);

    globalTimeOuts.set(postId, timeoutId);
  }

  const displayName = post.username || "Player";
  const timeLabel = timeAgo(post.createdAt);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-ink-850 transition-colors hover:border-white/20">
      <div className="flex items-start gap-3 p-5">
        <Avatar name={displayName} src={post.userAvatarUrl} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-semibold text-mist-100">
              {displayName}
            </span>

            {timeLabel && (
              <>
                <span className="text-mist-600" aria-hidden="true">
                  ·
                </span>
                <time
                  dateTime={post.createdAt}
                  className="text-xs text-mist-500"
                >
                  {timeLabel}
                </time>
              </>
            )}
          </div>

          <p className="mt-2 whitespace-pre-line break-words text-[15px] leading-7 text-mist-200">
            {post.content}
          </p>
        </div>
      </div>

      {post.imageUrl && (
        <div className="border-y border-white/10 bg-ink-900">
          <img
            src={post.imageUrl}
            alt=""
            loading="lazy"
            className="max-h-[30rem] w-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-1 px-3 py-2.5">
        <button
          type="button"
          onClick={handleLikeClick}
          aria-pressed={liked}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            liked
              ? "bg-lime-400/10 text-lime-300 hover:bg-lime-400/15"
              : "text-mist-400 hover:bg-white/5 hover:text-mist-100"
          }`}
        >
          <HeartIcon filled={liked} />
          <span>{likeCount}</span>
          <span className="sr-only">{liked ? "Unlike post" : "Like post"}</span>
        </button>

        <button
          type="button"
          onClick={() => setCommentsOpen((open) => !open)}
          aria-expanded={commentsOpen}
          aria-controls={`comments-${post.id}`}
          title={`${commentCount} comments`}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            commentsOpen
              ? "bg-white/5 text-mist-100"
              : "text-mist-400 hover:bg-white/5 hover:text-mist-100"
          }`}
        >
          <CommentIcon />
          {commentCount}
          <span className="sr-only">
            {commentsOpen ? "Hide comments" : "View comments"}
          </span>
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="border-t border-red-500/20 bg-red-500/10 px-5 py-2 text-xs text-red-300"
        >
          {error}
        </p>
      )}

      {commentsOpen && (
        <CommentsSection
          postId={post.id}
          postOwnerId={post.userId}
          initialTotal={commentCount}
          onTotalChange={handleCommentTotal}
        />
      )}
    </article>
  );
}

export default PostCard;
