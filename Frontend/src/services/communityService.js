import { apiRequest } from "./apiService";

export function getFeed(page = 0, size = 10) {
  return apiRequest(`/posts?page=${page}&size=${size}`);
}

export function createPost(content, imageUrl) {
  return apiRequest("/posts", {
    method: "POST",
    //use body when there is data to sent back to backend
    body: JSON.stringify({ content, imageUrl }),
  });
}

export function deletePost(postId) {
  return apiRequest(`/posts/${postId}`, {
    method: "DELETE",
  });
}

export function getComments(postId, page = 0, size = 10) {
  return apiRequest(`/posts/${postId}/comments?page=${page}&size=${size}`);
}

export function addComment(postId, content) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function deleteComment(postId) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: "DELETE",
  });
}

export function likePost(postId) {
  return apiRequest(`/posts/${postId}/likes`, {
    method: "POST",
  });
}

export function unLikePost(postId) {
  return apiRequest(`/posts/${postId}/likes`, {
    method: "DELETE",
  });
}
