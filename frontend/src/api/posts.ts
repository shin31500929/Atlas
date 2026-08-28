import { apiClient } from "./client";

export const getPosts = async () => {
  const response = await apiClient.get("/posts");

  return response.data;
};

export const createPost = async (content: string) => {
  const response = await apiClient.post("/posts", {
    content,
  });

  return response.data;
};

export const likePost = async (postId: string) => {
  const response = await apiClient.post(`/posts/${postId}/likes`);

  return response.data;
};

export const unlikePost = async (postId: string) => {
  const response = await apiClient.delete(`/posts/${postId}/likes`);

  return response.data;
};
