export const globalFeedCache = { posts: null };

export function updateCachedPost(postId, updater) {
  if (!globalFeedCache.posts) return;

  globalFeedCache.posts = globalFeedCache.posts.map((post) =>
    post.id === postId ? { ...post, ...updater(post) } : post,
  );
}
