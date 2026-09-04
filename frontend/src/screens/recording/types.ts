export type LatLng = {
  latitude: number;
  longitude: number;
};

export type GeoPoint = LatLng & {
  timestamp: number;
};

export type RecordingStats = {
  elapsedMs: number;
  distanceKm: number;
  currentSpeedKmh: number;
  maxSpeedKmh: number;
};

export type RecordingStatus = "recording" | "paused" | "stopped";

export type GpsStatus = "idle" | "acquiring" | "active" | "denied";

export type RecordingSession = RecordingStats & {
  route: GeoPoint[];
  story?: string;
  tags?: string[];
  status: RecordingStatus;
  /** 記録開始時の現在地 */
  startLocation?: LatLng;
  /** 目的地として設定したゴール */
  goalLocation?: LatLng;
  /** ISO 8601 */
  startedAt?: string;
  /** ISO 8601 */
  endedAt?: string;
};

/** 端末ローカルに保存する移動記録 */
export type TripRecord = {
  id: string;
  startLocation: LatLng;
  goalLocation: LatLng;
  startedAt: string;
  endedAt: string;
  distanceKm: number;
  maxSpeedKmh: number;
  elapsedMs?: number;
  route?: GeoPoint[];
  story?: string;
  tags?: string[];
};
