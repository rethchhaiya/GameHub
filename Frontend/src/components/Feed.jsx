import { useEffect, useState } from "react";
import { getFeed } from "../services/communityService";
import { globalFeedCache } from "../utils/feedCache";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";

function PostSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-white/10 bg-ink-850 p-5"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="h-2.5 w-20 rounded bg-white/5" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-3/4 rounded bg-white/5" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-8 w-16 rounded-lg bg-white/5" />
        <div className="h-8 w-16 rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto h-8 w-8 text-lime-400"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function Feed() {
  const [posts, setPosts] = useState(() => globalFeedCache.posts ?? []);
  const [loading, setLoading] = useState(() => globalFeedCache.posts === null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (globalFeedCache.posts !== null && reloadKey === 0) return;

    let cancelled = false;

    getFeed(0, 10)
      .then((data) => {
        if (cancelled) return;

        setPosts(data.content);
        globalFeedCache.posts = data.content;
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
  }, [reloadKey]);

  function handleCreated(post) {
    const next = [post, ...posts];
    setPosts(next);
    globalFeedCache.posts = next;
  }

  function retry() {
    globalFeedCache.posts = null;
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }

  return (
    <div className="space-y-5">
      <PostComposer onCreated={handleCreated} />

      <div className="flex items-center justify-between px-1">
        <h2 className="font-display text-lg font-semibold text-white">
          Latest posts
        </h2>

        {!loading && posts.length > 0 && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-mist-500">
            {posts.length} posts
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-sm font-semibold text-red-200">
            We couldn't load the feed.
          </p>
          <p className="mt-1 text-xs text-red-300/80">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 rounded-lg bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-200 ring-1 ring-red-400/30 transition hover:bg-red-400/20"
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-ink-900 px-6 py-14 text-center">
          <ChatIcon />
          <h3 className="mt-3 font-display text-lg font-semibold text-white">
            No posts yet
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-mist-500">
            Be the first to start the conversation — share what you're playing
            right now.
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <p className="pb-2 text-center text-xs text-mist-600">
          You're all caught up — showing the latest posts.
        </p>
      )}
    </div>
  );
}

export default Feed;
