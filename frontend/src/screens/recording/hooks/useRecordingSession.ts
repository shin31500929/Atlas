import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import type {
  GeoPoint,
  GpsStatus,
  LatLng,
  RecordingSession,
  RecordingStats,
} from "../types";
import { haversineDistance, msToKmh } from "../utils";

const INITIAL_STATS: RecordingStats = {
  elapsedMs: 0,
  distanceKm: 0,
  currentSpeedKmh: 0,
  maxSpeedKmh: 0,
};

type UseRecordingSessionOptions = {
  destination?: LatLng;
  startLocation?: LatLng;
};

export function useRecordingSession(options: UseRecordingSessionOptions = {}) {
  const { destination, startLocation } = options;

  const [stats, setStats] = useState<RecordingStats>(INITIAL_STATS);
  const [route, setRoute] = useState<GeoPoint[]>([]);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("idle");
  const [isPaused, setIsPaused] = useState(false);

  const routeRef = useRef<GeoPoint[]>([]);
  const statsRef = useRef<RecordingStats>(INITIAL_STATS);
  const isPausedRef = useRef(false);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPointRef = useRef<GeoPoint | null>(null);
  const startLocationRef = useRef<LatLng | undefined>(startLocation);
  const startedAtRef = useRef<string>(new Date().toISOString());
  const destinationRef = useRef<LatLng | undefined>(destination);

  useEffect(() => {
    destinationRef.current = destination;
  }, [destination]);

  useEffect(() => {
    if (startLocation) {
      startLocationRef.current = startLocation;
    }
  }, [startLocation]);

  const syncStats = useCallback((updater: (prev: RecordingStats) => RecordingStats) => {
    setStats((prev) => {
      const next = updater(prev);
      statsRef.current = next;
      return next;
    });
  }, []);

  const stopWatch = useCallback(async () => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
  }, []);

  const startWatch = useCallback(async () => {
    await stopWatch();

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      (location) => {
        if (isPausedRef.current) {
          return;
        }

        const point: GeoPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp,
        };

        if (!startLocationRef.current) {
          startLocationRef.current = {
            latitude: point.latitude,
            longitude: point.longitude,
          };
        }

        routeRef.current = [...routeRef.current, point];
        setRoute(routeRef.current);

        const speedKmh = msToKmh(location.coords.speed);
        let distanceDelta = 0;

        if (lastPointRef.current) {
          distanceDelta = haversineDistance(lastPointRef.current, point);
        }
        lastPointRef.current = point;

        syncStats((prev) => ({
          ...prev,
          distanceKm: prev.distanceKm + distanceDelta,
          currentSpeedKmh: speedKmh,
          maxSpeedKmh: Math.max(prev.maxSpeedKmh, speedKmh),
        }));

        setGpsStatus("active");
      },
    );
  }, [stopWatch, syncStats]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      return;
    }

    timerRef.current = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }

      syncStats((prev) => ({
        ...prev,
        elapsedMs: prev.elapsedMs + 1000,
      }));
    }, 1000);
  }, [syncStats]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    startedAtRef.current = new Date().toISOString();

    const init = async () => {
      setGpsStatus("acquiring");

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) {
        return;
      }

      if (status !== "granted") {
        setGpsStatus("denied");
        return;
      }

      await startWatch();
      startTimer();
    };

    init();

    return () => {
      isMounted = false;
      stopWatch();
      stopTimer();
    };
  }, [startWatch, startTimer, stopWatch, stopTimer]);

  const pause = useCallback(async () => {
    isPausedRef.current = true;
    setIsPaused(true);
    await stopWatch();
  }, [stopWatch]);

  const resume = useCallback(async () => {
    isPausedRef.current = false;
    setIsPaused(false);
    await startWatch();
    startTimer();
  }, [startWatch, startTimer]);

  const stop = useCallback((): RecordingSession => {
    isPausedRef.current = true;
    setIsPaused(true);
    stopWatch();
    stopTimer();

    return {
      ...statsRef.current,
      route: routeRef.current,
      status: "stopped",
      startLocation: startLocationRef.current,
      goalLocation: destinationRef.current,
      startedAt: startedAtRef.current,
      endedAt: new Date().toISOString(),
    };
  }, [stopWatch, stopTimer]);

  return {
    stats,
    route,
    gpsStatus,
    isPaused,
    pause,
    resume,
    stop,
  };
}
