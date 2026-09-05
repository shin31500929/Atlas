import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { addRecordLocation, createRecord } from "../../../api/records";
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
  const [recordId, setRecordId] = useState<string | null>(null);

  const routeRef = useRef<GeoPoint[]>([]);
  const statsRef = useRef<RecordingStats>(INITIAL_STATS);
  const isPausedRef = useRef(false);

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lastPointRef = useRef<GeoPoint | null>(null);
  const latestPointRef = useRef<GeoPoint | null>(null);

  const startLocationRef = useRef<LatLng | undefined>(startLocation);
  const startedAtRef = useRef<string>(new Date().toISOString());
  const destinationRef = useRef<LatLng | undefined>(destination);

  const recordIdRef = useRef<string | null>(null);

  const syncStats = useCallback(
    (updater: (prev: RecordingStats) => RecordingStats) => {
      setStats((prev) => {
        const next = updater(prev);
        statsRef.current = next;
        return next;
      });
    },
    [],
  );

  const stopWatch = useCallback(async () => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopSyncTimer = useCallback(() => {
    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
      syncTimerRef.current = null;
    }
  }, []);

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

  const startSyncTimer = useCallback(() => {
    console.log("START SYNC TIMER");

    if (syncTimerRef.current) {
      console.log("既存のSYNC TIMERを停止");
      clearInterval(syncTimerRef.current);
      syncTimerRef.current = null;
    }

    syncTimerRef.current = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }

      const currentRecordId = recordIdRef.current;
      const latestPoint = latestPointRef.current;

      if (!currentRecordId || !latestPoint) {
        return;
      }

      console.log("GPS 10秒同期:", new Date().toISOString(), latestPoint);

      addRecordLocation(
        currentRecordId,
        latestPoint.latitude,
        latestPoint.longitude,
        new Date(latestPoint.timestamp).toISOString(),
      ).catch((error) => {
        console.error("GPS送信エラー:", error);
      });
    }, 10000);
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

        latestPointRef.current = point;

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

  useEffect(() => {
    let isMounted = true;

    startedAtRef.current = new Date().toISOString();

    const init = async () => {
      console.log("INIT RECORDING SESSION");

      setGpsStatus("acquiring");

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (!isMounted) {
        return;
      }

      if (status !== "granted") {
        setGpsStatus("denied");
        return;
      }

      try {
        const record = await createRecord("移動記録", startedAtRef.current);

        if (!isMounted) {
          return;
        }

        recordIdRef.current = record.id;
        setRecordId(record.id);

        await startWatch();

        if (!isMounted) {
          return;
        }

        startTimer();
        startSyncTimer();
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Record作成エラー:", error);

        await startWatch();

        if (!isMounted) {
          return;
        }

        startTimer();
      }
    };

    init();

    return () => {
      console.log("CLEANUP RECORDING SESSION");

      isMounted = false;

      stopWatch();
      stopTimer();
      stopSyncTimer();
    };
  }, [
    startWatch,
    startTimer,
    startSyncTimer,
    stopWatch,
    stopTimer,
    stopSyncTimer,
  ]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
  }, []);

  const stop = useCallback((): RecordingSession => {
    isPausedRef.current = true;
    setIsPaused(true);

    stopWatch();
    stopTimer();
    stopSyncTimer();

    return {
      ...statsRef.current,
      route: routeRef.current,
      status: "stopped",
      startLocation: startLocationRef.current,
      goalLocation: destinationRef.current,
      startedAt: startedAtRef.current,
      endedAt: new Date().toISOString(),
    };
  }, [stopWatch, stopTimer, stopSyncTimer]);

  return {
    stats,
    route,
    gpsStatus,
    isPaused,
    recordId,
    pause,
    resume,
    stop,
  };
}
