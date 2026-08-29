import { apiClient } from './client';

export const getRecords = async () => {
  const response = await apiClient.get('/records');

  return response.data;
};

export const createRecord = async (
  title: string,
  startedAt: string,
) => {
  const response = await apiClient.post('/records', {
    title,
    startedAt,
  });

  return response.data;
};

export const endRecord = async (id: string) => {
  const response = await apiClient.patch(`/records/${id}`);

  return response.data;
};