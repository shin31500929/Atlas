import {
  getRecordLocations,
  getRecords,
  type ServerLocation,
  type ServerRecord,
} from "../../../api/records";
import { getTrips } from "../storage/tripStorage";
import { haversineDistance } from "../utils";
import type { GeoPoint, LatLng, TripRecord } from "../types";

/**
 * 「記録タブの一覧をどこから持ってくるか」をここ1か所にまとめる層。
 *
 * 方針:
 *   サーバー優先。GET /records で記録の一覧、GET /records/:id/locations で
 *   その記録の座標列を取って、画面が使う TripRecord に組み立てる。
 *   通信に失敗したら端末に保存してあるキャッシュ（AsyncStorage）を返し、
 *   画面側で「オフライン表示」バッジを出す。
 *
 * 距離・最高速度・移動時間はバックエンドが持っていないので、
 * 取得した座標列からこちらで計算している。
 */

export type ListTripsResult = {
  trips: TripRecord[];
  /** true ならサーバーから取れた / false ならローカルのキャッシュ */
  fromServer: boolean;
};

const ORIGIN: LatLng = { latitude: 0, longitude: 0 };

/** 座標の配列を、時刻順に並べた GeoPoint に変換する */
function toRoute(locations: ServerLocation[]): GeoPoint[] {
  return locations
    .map((location) => ({
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      timestamp: Date.parse(location.recordedAt),
    }))
    .filter(
      (point) =>
        Number.isFinite(point.latitude) &&
        Number.isFinite(point.longitude) &&
        Number.isFinite(point.timestamp),
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

/** 座標列から、合計距離(km)と最高速度(km/h)を出す */
function summarizeRoute(route: GeoPoint[]): {
  distanceKm: number;
  maxSpeedKmh: number;
} {
  let distanceKm = 0;
  let maxSpeedKmh = 0;

  for (let i = 1; i < route.length; i += 1) {
    const previous = route[i - 1];
    const current = route[i];

    const segmentKm = haversineDistance(previous, current);
    distanceKm += segmentKm;

    // 2点の時刻差から区間の速度を出して、最大値を拾う
    const hours = (current.timestamp - previous.timestamp) / (1000 * 60 * 60);
    if (hours > 0) {
      maxSpeedKmh = Math.max(maxSpeedKmh, segmentKm / hours);
    }
  }

  return { distanceKm, maxSpeedKmh };
}

/** サーバーの記録 + 座標列を、画面が使う TripRecord に組み立てる */
function toTripRecord(
  record: ServerRecord,
  locations: ServerLocation[],
): TripRecord {
  const route = toRoute(locations);
  const first = route[0];
  const last = route[route.length - 1];
  const { distanceKm, maxSpeedKmh } = summarizeRoute(route);

  const startedAtMs = Date.parse(record.startedAt);
  const endedAtMs = record.endedAt ? Date.parse(record.endedAt) : NaN;

  // 開始〜終了があればそれを使い、無ければ座標の時刻差で代用する
  let elapsedMs = 0;
  if (Number.isFinite(startedAtMs) && Number.isFinite(endedAtMs)) {
    elapsedMs = Math.max(0, endedAtMs - startedAtMs);
  } else if (first && last) {
    elapsedMs = Math.max(0, last.timestamp - first.timestamp);
  }

  return {
    id: record.id,
    startLocation: first
      ? { latitude: first.latitude, longitude: first.longitude }
      : ORIGIN,
    goalLocation: last
      ? { latitude: last.latitude, longitude: last.longitude }
      : ORIGIN,
    startedAt: record.startedAt,
    endedAt: record.endedAt ?? record.startedAt,
    distanceKm,
    maxSpeedKmh,
    elapsedMs,
    route,
    story: record.story ?? undefined,
    tags: record.tags ?? [],
  };
}

/** 記録1件に座標列をくっつけて TripRecord にする */
async function fetchTripRecord(record: ServerRecord): Promise<TripRecord> {
  try {
    const locations = await getRecordLocations(record.id);
    return toTripRecord(record, locations);
  } catch {
    // 座標だけ取れなくても、記録自体は表示する
    return toTripRecord(record, []);
  }
}

export async function listTripRecords(): Promise<ListTripsResult> {
  try {
    const records = await getRecords();

    // 記録ごとに座標列を取りに行く（件数が増えたらサーバー側でまとめて返す形にしたい）
    const trips = await Promise.all(
      records.map((record: ServerRecord) => fetchTripRecord(record)),
    );

    // 新しい順
    trips.sort((a, b) => b.startedAt.localeCompare(a.startedAt));

    return { trips, fromServer: true };
  } catch (error) {
    console.warn(
      "[tripRepository] サーバーから取得できないので端末のキャッシュを表示します",
      error,
    );

    return { trips: await getTrips(), fromServer: false };
  }
}

/**
 * 記録を1件だけ取ってくる（タイムラインの投稿から詳細を開くとき用）。
 *
 * バックエンドに GET /records/:id が無いので、一覧から絞り込んでいる。
 * 単体取得のエンドポイントが増えたら、この関数の中だけ差し替えればいい。
 * サーバーに無ければ端末のキャッシュも見にいく。
 */
export async function findTripRecord(
  recordId: string,
): Promise<TripRecord | null> {
  try {
    const records = await getRecords();
    const record = records.find(
      (item: ServerRecord) => String(item.id) === String(recordId),
    );

    if (record) {
      return await fetchTripRecord(record);
    }
  } catch (error) {
    console.warn(
      "[tripRepository] サーバーから記録を取得できませんでした",
      error,
    );
  }

  const cached = await getTrips();

  return cached.find((trip) => String(trip.id) === String(recordId)) ?? null;
}
