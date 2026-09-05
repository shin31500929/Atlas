/** 緯度・経度のペア */
export type LatLng = {
  latitude: number;
  longitude: number;
};

/** ルート上の1点（緯度経度 + 記録時刻のミリ秒） */
export type GeoPoint = LatLng & {
  timestamp: number;
};

/** サーバーに保存する移動記録の本体 */
export type TripRecord = {
  id: string;
  title: string;
  startLocation: LatLng;
  goalLocation: LatLng | null;
  /** ISO 8601 */
  startedAt: string;
  /** ISO 8601 / 記録中は null */
  endedAt: string | null;
  distanceKm: number;
  maxSpeedKmh: number;
  elapsedMs: number;
  route: GeoPoint[];
  story: string | null;
  tags: string[];
  /** ISO 8601 */
  createdAt: string;
};

/** POST /records で受け取るリクエストボディ */
export type CreateRecordBody = {
  title?: string;
  startLocation: LatLng;
  goalLocation?: LatLng | null;
  startedAt: string;
  endedAt?: string | null;
  distanceKm?: number;
  maxSpeedKmh?: number;
  elapsedMs?: number;
  route?: GeoPoint[];
  story?: string | null;
  tags?: string[];
};

/** PATCH /records/:id で受け取るリクエストボディ（全部あってもなくてもいい） */
export type UpdateRecordBody = Partial<CreateRecordBody>;
