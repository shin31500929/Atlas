import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TripRecord } from "../types";

const TRIPS_STORAGE_KEY = "@atlas/trips";

export async function getTrips(): Promise<TripRecord[]> {
  const raw = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as TripRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveTrip(
  trip: Omit<TripRecord, "id"> & { id?: string },
): Promise<TripRecord> {
  const record: TripRecord = {
    ...trip,
    id: trip.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };

  const trips = await getTrips();
  trips.unshift(record);
  await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  return record;
}

export async function clearTrips(): Promise<void> {
  await AsyncStorage.removeItem(TRIPS_STORAGE_KEY);
}
