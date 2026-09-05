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

//GPS送信用関数↓

export const addRecordLocation = async (
  recordId: string,
  latitude: number,
  longitude: number,
  recordedAt: string,
) => {
  const response = await apiClient.post(
    `/records/${recordId}/locations`,
    {
      latitude,
      longitude,
      recordedAt,
    },
  );

  return response.data;
};
