import type { GeoPoint, LatLng, RecordingSession, TripRecord } from "./types";

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

/** 発表会用デモ */
export const DEMO_PRESENTATION = true;
/** デモ速度: 1 m/s（= 3.6 km/h） */
export const DEMO_SPEED_M_PER_SEC = 1;
/** 位置送信・UI更新の間隔 */
export const DEMO_TICK_MS = 500;
/** 近すぎるピンでも最低これだけ走る（秒） */
export const DEMO_MIN_DURATION_MS = 3000;
/** 遠すぎるピンでも最大これで打ち切り（1 m/s × 10秒 = 10m 進む） */
export const DEMO_MAX_DURATION_MS = 10000;

/** 発表・シミュレータ用のデフォルト現在地（東京駅） */
export const DEFAULT_TOKYO: LatLng = {
  latitude: 35.6812,
  longitude: 139.7671,
};

/** 日本付近のざっくり範囲（これ外ならシミュレータ海外位置とみなす） */
export function isInJapan(coord: LatLng): boolean {
  return (
    coord.latitude >= 24 &&
    coord.latitude <= 46 &&
    coord.longitude >= 122 &&
    coord.longitude <= 154
  );
}

/** 吉祥寺駅 */
const KICHIJOJI: GeoPoint = {
  latitude: 35.70312,
  longitude: 139.57982,
  timestamp: 0,
};

/** 箱根湯本駅（箱根の玄関口） */
const HAKONE_YUMOTO: GeoPoint = {
  latitude: 35.23364,
  longitude: 139.10366,
  timestamp: 0,
};

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const MOCK_STARTED_AT = "2026-09-06T09:00:00.000Z";
const MOCK_ENDED_AT = "2026-09-06T12:00:00.000Z";

/**
 * モック: 吉祥寺駅 → 箱根湯本駅
 * 最高時速 110 km/h・移動時間 3 時間・距離 約 90 km
 */
export const MOCK_SESSION: RecordingSession = {
  elapsedMs: THREE_HOURS_MS,
  distanceKm: 90.2,
  currentSpeedKmh: 42,
  maxSpeedKmh: 110,
  route: [
    { ...KICHIJOJI, timestamp: Date.parse(MOCK_STARTED_AT) },
    {
      latitude: 35.6575,
      longitude: 139.5445,
      timestamp: Date.parse(MOCK_STARTED_AT) + 25 * 60 * 1000,
    },
    {
      latitude: 35.6558,
      longitude: 139.3382,
      timestamp: Date.parse(MOCK_STARTED_AT) + 55 * 60 * 1000,
    },
    {
      latitude: 35.6162,
      longitude: 139.1925,
      timestamp: Date.parse(MOCK_STARTED_AT) + 85 * 60 * 1000,
    },
    {
      latitude: 35.4431,
      longitude: 139.3428,
      timestamp: Date.parse(MOCK_STARTED_AT) + 115 * 60 * 1000,
    },
    {
      latitude: 35.2895,
      longitude: 139.1598,
      timestamp: Date.parse(MOCK_STARTED_AT) + 150 * 60 * 1000,
    },
    {
      latitude: 35.2482,
      longitude: 139.1184,
      timestamp: Date.parse(MOCK_STARTED_AT) + 170 * 60 * 1000,
    },
    { ...HAKONE_YUMOTO, timestamp: Date.parse(MOCK_ENDED_AT) },
  ],
  story:
    "吉祥寺駅から箱根湯本駅までドライブ。中央道〜東名経由で約3時間、最高時速110km。",
  tags: ["吉祥寺", "箱根", "ドライブ", "箱根湯本"],
  status: "stopped",
  startLocation: {
    latitude: KICHIJOJI.latitude,
    longitude: KICHIJOJI.longitude,
  },
  goalLocation: {
    latitude: HAKONE_YUMOTO.latitude,
    longitude: HAKONE_YUMOTO.longitude,
  },
  startedAt: MOCK_STARTED_AT,
  endedAt: MOCK_ENDED_AT,
};

/** 記録タブ一覧用のモック Trip */
export const MOCK_TRIP: TripRecord = {
  id: "mock-kichijoji-hakone",
  startLocation: MOCK_SESSION.startLocation!,
  goalLocation: MOCK_SESSION.goalLocation!,
  startedAt: MOCK_STARTED_AT,
  endedAt: MOCK_ENDED_AT,
  distanceKm: MOCK_SESSION.distanceKm,
  maxSpeedKmh: MOCK_SESSION.maxSpeedKmh,
  elapsedMs: MOCK_SESSION.elapsedMs,
  route: MOCK_SESSION.route,
  story: MOCK_SESSION.story,
  tags: MOCK_SESSION.tags,
};
