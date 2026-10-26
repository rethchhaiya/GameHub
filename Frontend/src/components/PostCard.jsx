import { useEffect, useRef, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import { likePost, unLikePost } from "../services/communityService";

//survivse navigation and
const globalLikeQueue = new Map();
const globalTimeOuts = new Map();

//survive unmount
const globalLikeState = new Map();

async function processPendingLike(postId, finalLiked, onConfigSuccess) {
  //delete time out(this code was written my me AKA Reth Chhaiya)
  globalTimeOuts.delete(postId);
  globalLikeQueue.delete(postId);

  try {
    const data = finalLiked ? await likePost(postId) : await unLikePost(postId);
    if (data && onConfigSuccess) {
      globalLikeState.set(postId, {
        liked: data.likedByCurrentUser,
        likeCount: data.likeCount
      });
      if(onConfigSuccess){
        onConfigSuccess(data);
      }
    }
  } catch (err) {
    console.error(`Cannot update post ${postId} to server`, err);
  }
}

function flushQueueBeforeUnload() {
  globalLikeQueue.forEach((finalLiked, postId) => {
    const url = `/posts/${postId}/likes`;

    const httpMethod = finalLiked ? "POST" : "DELETE";

    fetch(url, {
      method: httpMethod,
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.error("Error flushing queue", err));
  });
}

//cart component
function PostCard({ post }) {
    const [liked, setLiked] = useState(() => {
        const cached = globalLikeState.get(post.id);
        return cached ? cached.liked : post.likedByCurrentUser;
    });
    const [likeCount, setLikeCount] = useState(() => {
        const cached = globalLikeState.get(post.id);
        return cached ? cached.likeCount : post.likeCount;
    })
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //prevent memory leak
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushQueueBeforeUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  async function handleLikeClick() {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const next = !liked;
    const nextCount = likeCount + (next ? 1 : -1);
    setLiked(next);
    setError("");

    globalLikeState.set(post.id, {liked : next , likeCount : nextCount});

    // delete old timeout if continue clicking
    const postId = post.id;

    //if double click delete
    if (next === post.likedByCurrentUser) {
      if (globalTimeOuts.has(postId)) {
        clearTimeout(globalTimeOuts.get(postId));
        globalTimeOuts.delete(postId);
      }
      globalLikeQueue.delete(postId);
      return;
    }

    globalLikeQueue.set(postId, next);

    if(globalTimeOuts.has(postId)){
        clearTimeout(globalTimeOuts.get(postId));
    }

    const timeoutId = setTimeout(() => {
        processPendingLike(postId, next, (data) => {
            setLiked(data.likedByCurrentUser);
            setLikeCount(data.likeCount);
        });
    }, 800);
    globalTimeOuts.set(postId, timeoutId);
  }

  return (
    <div>
      <p>{post.username}</p>
      <p>{post.content}</p>
      <button onClick={handleLikeClick} aria-pressed={liked}>
        {liked ? "♥ Liked" : "♡ Like"} ({likeCount})
      </button>
      <span>{post.commentCount}. comments</span>
      <p>{error && <p>{error}</p>}</p>
    </div>
  );
}

export default PostCard;
