import { apiClient } from "./client";

export const getPosts = async (limit: number, offset: number) => {
  const response = await apiClient.get("/posts", {
    params: {
      limit,
      offset,
    },
  });

  return response.data;
};

export const createPost = async (
  content: string,
  imageUri: string | null,
) => {
  const formData = new FormData();

  formData.append("content", content);

  if (imageUri) {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const filename =
      imageUri.split("/").pop() ?? "image.jpg";

    formData.append(
      "image",
      new File([blob], filename, {
        type: blob.type || "image/jpeg",
      }),
    );
  }

  const response = await apiClient.post("/posts", formData);

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

// 移動記録からタイムラインに投稿する用 ↓

/** 投稿に紐づく移動記録のサマリ（backend/src/posts/posts.service.ts と対応） */
export type PostTrip = {
  recordId: string | null;
  distanceKm: number;
  maxSpeedKmh: number;
  elapsedMs: number;
  /** ISO 8601 */
  startedAt: string;
  tags: string[];
};

/**
 * 移動記録をタイムラインに投稿する。
 * 画像は付けないので FormData ではなく JSON で送る。
 */
export const createTripPost = async (content: string, trip: PostTrip) => {
  const response = await apiClient.post("/posts", { content, trip });

  return response.data;
};
