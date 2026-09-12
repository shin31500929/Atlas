import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../../components/Header";
import type RootStackParamList from "../../navigation/type";
import RecordingControls from "./components/RecordingControls";
import StatCard from "./components/StatCard";
import {
  COLORS,
  DEFAULT_TOKYO,
  DEMO_MAX_DURATION_MS,
  DEMO_MIN_DURATION_MS,
  DEMO_SPEED_M_PER_SEC,
  DEMO_TICK_MS,
} from "./constants";
import {
  addRecordLocation,
  createRecord,
  endRecord,
} from "../../api/records";
import type { GeoPoint, LatLng, RecordingSession } from "./types";
import {
  formatElapsedTime,
  haversineDistance,
} from "./utils";

type Props = NativeStackScreenProps<RootStackParamList, "Recording">;

type LiveStats = {
  elapsedMs: number;
  distanceM: number;
  speedMps: number;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function lerp(a: LatLng, b: LatLng, t: number): LatLng {
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: a.longitude + (b.longitude - a.longitude) * t,
  };
}

function RecordingScreen({ navigation, route }: Props) {
  const destination = route.params?.destination;
  const startLocation = route.params?.startLocation;

  const startLat = startLocation?.latitude ?? DEFAULT_TOKYO.latitude;
  const startLng = startLocation?.longitude ?? DEFAULT_TOKYO.longitude;
  const goalLat = destination?.latitude ?? startLat + 0.0001;
  const goalLng = destination?.longitude ?? startLng + 0.0001;

  const [stats, setStats] = useState<LiveStats>({
    elapsedMs: 0,
    distanceM: 0,
    speedMps: DEMO_SPEED_M_PER_SEC,
  });
  const [statusText, setStatusText] = useState("準備中…");
  const [locationSent, setLocationSent] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const stoppedRef = useRef(false);
  const pausedRef = useRef(false);
  const finishingRef = useRef(false);
  const recordIdRef = useRef<string | null>(null);
  const routeRef = useRef<GeoPoint[]>([]);
  const startedAtRef = useRef(new Date().toISOString());
  const statsRef = useRef(stats);
  const runIdRef = useRef(0);
  const fromRef = useRef<LatLng>({ latitude: startLat, longitude: startLng });
  const toRef = useRef<LatLng>({ latitude: goalLat, longitude: goalLng });

  statsRef.current = stats;

  useEffect(() => {
    const runId = ++runIdRef.current;
    const isActive = () => runIdRef.current === runId && !stoppedRef.current;

    stoppedRef.current = false;
    pausedRef.current = false;
    finishingRef.current = false;
    recordIdRef.current = null;
    routeRef.current = [];
    setLocationSent(0);
    startedAtRef.current = new Date().toISOString();

    // ピン地図と同じ現在地からスタート
    const from: LatLng = { latitude: startLat, longitude: startLng };
    const to: LatLng = { latitude: goalLat, longitude: goalLng };
    fromRef.current = from;
    toRef.current = to;

    const fullDistanceM =
      haversineDistance(
        { ...from, timestamp: 0 },
        { ...to, timestamp: 0 },
      ) * 1000;

    const naturalDurationMs =
      (Math.max(fullDistanceM, 1) / DEMO_SPEED_M_PER_SEC) * 1000;
    const durationMs = Math.min(
      DEMO_MAX_DURATION_MS,
      Math.max(DEMO_MIN_DURATION_MS, naturalDurationMs),
    );
    // 1 m/s で duration 秒走れる距離（遠いピンでも最大約10m）
    const travelDistanceM = Math.min(
      fullDistanceM,
      DEMO_SPEED_M_PER_SEC * (durationMs / 1000),
    );
    const endProgress =
      fullDistanceM > 0 ? Math.min(1, travelDistanceM / fullDistanceM) : 1;
    const endPoint = lerp(from, to, endProgress);

    const ticks = Math.max(6, Math.round(durationMs / DEMO_TICK_MS));
    const speedKmh = DEMO_SPEED_M_PER_SEC * 3.6;

    const finish = async (session: RecordingSession) => {
      if (finishingRef.current) {
        return;
      }
      finishingRef.current = true;
      setFinishing(true);

      const id = recordIdRef.current;
      if (id) {
        try {
          await endRecord(id);
          console.log("[recording] END RECORD", id);
        } catch (error) {
          console.error("記録終了API連携エラー:", error);
        }
      }

      navigation.replace("Confirm", {
        session,
        recordId: recordIdRef.current,
      });
    };

    const run = async () => {
      console.log("[recording] demo run start", {
        runId,
        from,
        to,
        fullDistanceM,
        travelDistanceM,
        durationMs,
      });
      setStatusText("記録を作成中…");

      try {
        const record = await createRecord(
          "移動記録",
          startedAtRef.current,
        );
        if (runIdRef.current !== runId) {
          return;
        }
        recordIdRef.current = String(record.id);
        console.log("[recording] CREATE RECORD", record.id);
      } catch (error) {
        console.error("Record作成エラー:", error);
        Alert.alert(
          "記録作成に失敗",
          "backend (http://localhost:3000) が起動しているか確認してください。",
        );
        return;
      }

      setStatusText(
        `1 m/s で直線移動中（約${Math.round(durationMs / 1000)}秒）`,
      );

      let sent = 0;

      for (let i = 0; i <= ticks; i += 1) {
        if (!isActive()) {
          break;
        }

        while (pausedRef.current && isActive()) {
          await sleep(100);
        }
        if (!isActive()) {
          break;
        }

        const t = i / ticks;
        const progress = endProgress * t;
        const point: GeoPoint = {
          ...lerp(from, to, progress),
          timestamp: Date.now(),
        };
        routeRef.current = [...routeRef.current, point];

        const live: LiveStats = {
          elapsedMs: Math.round(durationMs * t),
          distanceM: travelDistanceM * t,
          speedMps: DEMO_SPEED_M_PER_SEC,
        };
        statsRef.current = live;
        setStats(live);

        const id = recordIdRef.current;
        if (id) {
          try {
            await addRecordLocation(
              id,
              point.latitude,
              point.longitude,
              new Date(point.timestamp).toISOString(),
            );
            sent += 1;
            setLocationSent(sent);
          } catch (error) {
            console.error("[recording] ADD LOCATION failed", error);
          }
        }

        if (i < ticks) {
          await sleep(DEMO_TICK_MS);
        }
      }

      if (runIdRef.current !== runId) {
        return;
      }

      if (sent === 0) {
        Alert.alert(
          "位置が送れませんでした",
          "Metro をリロードし、backend ログに ADD LOCATION が出るか確認してください。",
        );
      }

      const session: RecordingSession = {
        elapsedMs: durationMs,
        distanceKm: travelDistanceM / 1000,
        currentSpeedKmh: speedKmh,
        maxSpeedKmh: speedKmh,
        route: routeRef.current,
        status: "stopped",
        startLocation: from,
        goalLocation: endPoint,
        startedAt: startedAtRef.current,
        endedAt: new Date().toISOString(),
      };

      setStatusText(`終了処理中…（位置 ${sent} 件送信）`);
      await finish(session);
    };

    void run();
  }, [startLat, startLng, goalLat, goalLng, navigation]);

  const handleStop = async () => {
    stoppedRef.current = true;
    if (finishingRef.current) {
      return;
    }
    finishingRef.current = true;
    setFinishing(true);

    const session: RecordingSession = {
      elapsedMs: statsRef.current.elapsedMs,
      distanceKm: statsRef.current.distanceM / 1000,
      currentSpeedKmh: DEMO_SPEED_M_PER_SEC * 3.6,
      maxSpeedKmh: DEMO_SPEED_M_PER_SEC * 3.6,
      route: routeRef.current,
      status: "stopped",
      startLocation: fromRef.current,
      goalLocation: toRef.current,
      startedAt: startedAtRef.current,
      endedAt: new Date().toISOString(),
    };

    const id = recordIdRef.current;
    if (id) {
      try {
        await endRecord(id);
      } catch (error) {
        console.error("記録終了API連携エラー:", error);
      }
    }
    navigation.replace("Confirm", {
      session,
      recordId: recordIdRef.current,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Header title="記録中" iconName="cog" onIconPress={() => {}} />

      <View style={styles.content}>
        <Text style={styles.demoBanner}>{statusText}</Text>
        <Text style={styles.meta}>
          出発: 現在地 ({startLat.toFixed(4)}, {startLng.toFixed(4)}) / 位置送信:{" "}
          {locationSent} 件
        </Text>

        {finishing ? (
          <View style={styles.finishing}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.finishingText}>バックエンドへ保存中…</Text>
          </View>
        ) : null}

        <View style={styles.elapsedSection}>
          <Text style={styles.elapsedTime}>
            {formatElapsedTime(stats.elapsedMs)}
          </Text>
          <Text style={styles.elapsedLabel}>経過時間</Text>
        </View>

        <View style={styles.speedSection}>
          <Text style={styles.speedLabel}>現在の速度</Text>
          <Text style={styles.speedValue}>{DEMO_SPEED_M_PER_SEC}</Text>
          <Text style={styles.speedUnit}>m/s（デモ）</Text>
          <Text style={styles.speedSub}>
            ≈ {(DEMO_SPEED_M_PER_SEC * 3.6).toFixed(1)} km/h
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="移動距離"
            value={stats.distanceM.toFixed(1)}
            unit="m"
          />
          <StatCard
            label="最高速度"
            value={String(DEMO_SPEED_M_PER_SEC)}
            unit="m/s"
          />
        </View>
      </View>

      <View style={styles.controls}>
        <RecordingControls
          isPaused={isPaused}
          onPause={() => {
            pausedRef.current = true;
            setIsPaused(true);
          }}
          onResume={() => {
            pausedRef.current = false;
            setIsPaused(false);
          }}
          onStop={handleStop}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 20,
  },
  demoBanner: {
    fontSize: 13,
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    color: COLORS.label,
    textAlign: "center",
  },
  finishing: {
    alignItems: "center",
    gap: 8,
  },
  finishingText: {
    fontSize: 13,
    color: COLORS.label,
  },
  elapsedSection: {
    alignItems: "center",
    marginTop: 8,
  },
  elapsedTime: {
    fontSize: 48,
    fontWeight: "700",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
    letterSpacing: 1,
  },
  elapsedLabel: {
    fontSize: 14,
    color: COLORS.label,
    marginTop: 6,
  },
  speedSection: {
    alignItems: "center",
  },
  speedLabel: {
    fontSize: 14,
    color: COLORS.label,
    marginBottom: 4,
  },
  speedValue: {
    fontSize: 64,
    fontWeight: "700",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
    lineHeight: 72,
  },
  speedUnit: {
    fontSize: 14,
    color: COLORS.label,
    marginTop: 2,
  },
  speedSub: {
    fontSize: 12,
    color: COLORS.label,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  controls: {
    paddingBottom: 24,
    paddingTop: 8,
  },
});

export default RecordingScreen;
