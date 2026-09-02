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
    const filename =
      imageUri.split("/").pop() ?? "image.jpg";

    formData.append("image", {
      uri: imageUri,
      name: filename,
      type: "image/jpeg",
    } as any);
  }

  const response = await apiClient.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
