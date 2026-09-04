import type { GeoPoint, RecordingSession } from "./types";

export const COLORS = {
  text: "#283D36",
  label: "#6b7974",
  primary: "#3A7D7E",
  border: "#a8bab2",
  stop: "#E53935",
  gpsActive: "#4CAF50",
  gpsDenied: "#E53935",
  gpsBadgeBg: "#E8F5E9",
  white: "#FFFFFF",
  mapPlaceholder: "#E8EDEA",
} as const;

export const MOCK_SESSION: RecordingSession = {
  elapsedMs: 5025000,
  distanceKm: 45.6,
  currentSpeedKmh: 68,
  maxSpeedKmh: 112,
  route: [
    { latitude: 35.232, longitude: 139.106, timestamp: 0 },
    { latitude: 35.241, longitude: 139.112, timestamp: 60000 },
    { latitude: 35.258, longitude: 139.025, timestamp: 120000 },
    { latitude: 35.271, longitude: 139.018, timestamp: 180000 },
  ] as GeoPoint[],
  story: "箱根の山道をドライブ！天気も良くて最高でした。",
  tags: ["箱根", "ドライブ", "絶景", "温泉"],
  status: "stopped",
  startLocation: { latitude: 35.232, longitude: 139.106 },
  goalLocation: { latitude: 35.271, longitude: 139.018 },
  startedAt: "2026-08-29T10:00:00.000Z",
  endedAt: "2026-08-29T11:23:45.000Z",
};
