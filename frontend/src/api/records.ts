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

export const updateRecordDetails = async (
  id: string,
  data: {
    story?: string | null;
    tags?: string[];
  },
) => {
  const response = await apiClient.patch(`/records/${id}/details`, data);

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

// 一覧表示用（バックエンドから記録を取ってくる）↓

/** GET /records が返す1件ぶんの形 */
export type ServerRecord = {
  id: string;
  title: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  story: string | null;
  tags: string[];
};

/** GET /records/:id/locations が返す1点ぶんの形 */
export type ServerLocation = {
  id: string;
  recordId: string;
  latitude: number;
  longitude: number;
  recordedAt: string;
};

export const getRecordLocations = async (
  recordId: string,
): Promise<ServerLocation[]> => {
  const response = await apiClient.get<ServerLocation[]>(
    `/records/${recordId}/locations`,
  );

  return response.data;
};
