import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../../components/Header";
import type RootStackParamList from "../../navigation/type";
import GpsStatusBadge from "./components/GpsStatusBadge";
import RecordingControls from "./components/RecordingControls";
import StatCard from "./components/StatCard";
import { COLORS } from "./constants";
import { useRecordingSession } from "./hooks/useRecordingSession";
import { createRecord, endRecord } from "../../api/records";
import {
  formatDistance,
  formatElapsedTime,
  formatSpeed,
} from "./utils";

type Props = NativeStackScreenProps<RootStackParamList, "Recording">;

function RecordingScreen({ navigation, route }: Props) {
  const { destination, startLocation } = route.params ?? {};
  const { stats, gpsStatus, isPaused, pause, resume, stop } =
    useRecordingSession({ destination, startLocation });

  const handleStop = async () => {
    const session = stop();

    // バックエンド API にも記録を保存（エラーでも画面遷移はする）
    try {
      const record = await createRecord(
        "移動記録",
        session.startedAt ?? new Date().toISOString(),
      );
      await endRecord(record.id);
    } catch (error) {
      console.error("記録API連携エラー:", error);
    }

    navigation.navigate("Confirm", { session });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Header title="記録中" iconName="cog" onIconPress={() => {}} />

      <View style={styles.content}>
        <GpsStatusBadge status={gpsStatus} />

        <View style={styles.elapsedSection}>
          <Text style={styles.elapsedTime}>
            {formatElapsedTime(stats.elapsedMs)}
          </Text>
          <Text style={styles.elapsedLabel}>経過時間</Text>
        </View>

        <View style={styles.speedSection}>
          <Text style={styles.speedLabel}>現在の速度</Text>
          <Text style={styles.speedValue}>
            {formatSpeed(stats.currentSpeedKmh)}
          </Text>
          <Text style={styles.speedUnit}>km/h</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="移動距離"
            value={formatDistance(stats.distanceKm)}
            unit="km"
          />
          <StatCard
            label="最高速度"
            value={formatSpeed(stats.maxSpeedKmh)}
            unit="km/h"
          />
        </View>
      </View>

      <View style={styles.controls}>
        <RecordingControls
          isPaused={isPaused}
          onPause={pause}
          onResume={resume}
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
    gap: 28,
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
