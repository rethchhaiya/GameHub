import { useEffect, useState } from "react";
import { getFeed } from "../services/communityService";
import PostCard from "./PostCard";

const globalFeedCache = { posts: null };

function Feed() {
  const [posts, setPosts] = useState(() => globalFeedCache.posts ?? []);
  const [loading, setLoading] = useState(() => globalFeedCache.posts === null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (globalFeedCache.posts !== null) return;

    getFeed(0, 10)
      .then((data) => {
        setPosts(data.content);
        globalFeedCache.posts = data.content;
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;