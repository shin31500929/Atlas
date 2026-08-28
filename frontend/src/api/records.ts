import { apiClient } from "./client";

export const getRecords = async () => {
  const response = await apiClient.get("/records");

  return response.data;
};

export const createRecord = async (
  title: string,
  startedAt: string,
) => {
  const response = await apiClient.post("/records", {
    title,
    startedAt,
  });

  return response.data;
};
