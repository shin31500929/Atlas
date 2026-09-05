import {
  createRecord,
  getRecords,
  type CreateRecordInput,
  type ServerRecord,
} from "../../../api/records";
import { getTrips as getLocalTrips, saveTrip as saveLocalTrip } from "../storage/tripStorage";
import type { LatLng, TripRecord } from "../types";

/**
 * 「どこに保存するか」をここ1か所にまとめる層（リポジトリ層）。
 *
 * 方針：
 *   保存 → まずバックエンドに投げる。成功したらローカルにもキャッシュ。
 *          失敗（サーバー落ち・圏外）したらローカルだけに保存して savedToServer: false を返す。
 *   一覧 → まずバックエンドから取る。失敗したらローカルのキャッシュを表示。
 *
 * 画面側は「サーバーかローカルか」を意識せず、この関数だけ呼べばいい。
 */

export type SaveTripInput = Omit<TripRecord, "id"> & { title?: string };

export type SaveTripResult = {
  trip: TripRecord;
  savedToServer: boolean;
  error?: unknown;
};

export type ListTripsResult = {
  trips: TripRecord[];
  fromServer: boolean;
};

/** サーバーのレコードを、画面で使っている TripRecord の形に変換する */
function toTripRecord(record: ServerRecord): TripRecord {
  const lastPoint = record.route?.[record.route.length - 1];
  const goalLocation: LatLng =
    record.goalLocation ??
    (lastPoint
      ? { latitude: lastPoint.latitude, longitude: lastPoint.longitude }
      : record.startLocation);

  return {
    id: record.id,
    startLocation: record.startLocation,
    goalLocation,
    startedAt: record.startedAt,
    endedAt: record.endedAt ?? record.startedAt,
    distanceKm: record.distanceKm,
    maxSpeedKmh: record.maxSpeedKmh,
    elapsedMs: record.elapsedMs,
    route: record.route ?? [],
    story: record.story ?? undefined,
    tags: record.tags ?? [],
  };
}

/** 画面の入力を、サーバーに送る形に変換する */
function toCreateInput(input: SaveTripInput): CreateRecordInput {
  return {
    title: input.title ?? "移動記録",
    startLocation: input.startLocation,
    goalLocation: input.goalLocation,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    distanceKm: input.distanceKm,
    maxSpeedKmh: input.maxSpeedKmh,
    elapsedMs: input.elapsedMs ?? 0,
    route: input.route ?? [],
    story: input.story ?? null,
    tags: input.tags ?? [],
  };
}

export async function saveTripRecord(
  input: SaveTripInput,
): Promise<SaveTripResult> {
  try {
    const created = await createRecord(toCreateInput(input));
    const trip = toTripRecord(created);

    // サーバー保存に成功しても、オフライン時に見られるようローカルにも残す
    await saveLocalTrip(trip);

    return { trip, savedToServer: true };
  } catch (error) {
    console.warn("[tripRepository] サーバー保存に失敗、ローカルに保存します", error);

    const trip = await saveLocalTrip(input);

    return { trip, savedToServer: false, error };
  }
}

export async function listTripRecords(): Promise<ListTripsResult> {
  try {
    const records = await getRecords();

    return { trips: records.map(toTripRecord), fromServer: true };
  } catch (error) {
    console.warn("[tripRepository] サーバー取得に失敗、ローカルを表示します", error);

    return { trips: await getLocalTrips(), fromServer: false };
  }
}
