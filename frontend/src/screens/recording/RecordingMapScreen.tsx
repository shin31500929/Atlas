import { ScrollView, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type RootStackParamList from "../../navigation/type";
import RecordingMap from "./components/RecordingMap";
import StatCard from "./components/StatCard";
import { COLORS, MOCK_SESSION } from "./constants";
import {
  formatDistance,
  formatElapsedTime,
  formatSpeed,
} from "./utils";

type Props = NativeStackScreenProps<RootStackParamList, "RecordingMap">;

function RecordingMapScreen({ route }: Props) {
  const trip = route.params?.trip;
  const routePoints = trip?.route ?? MOCK_SESSION.route;
  const goalLocation = trip?.goalLocation ?? MOCK_SESSION.goalLocation;
  const distanceKm = trip?.distanceKm ?? MOCK_SESSION.distanceKm;
  const maxSpeedKmh = trip?.maxSpeedKmh ?? MOCK_SESSION.maxSpeedKmh;
  const elapsedMs = trip?.elapsedMs ?? MOCK_SESSION.elapsedMs;
  // trip があるときはその内容のみ（未入力なら表示しない）。モックは trip 未指定時だけ使う
  const story = trip ? trip.story : MOCK_SESSION.story;
  const tags = trip ? (trip.tags ?? []) : (MOCK_SESSION.tags ?? []);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <RecordingMap route={routePoints} goalLocation={goalLocation} />

        <View style={styles.statsRow}>
          <StatCard
            label="移動距離"
            value={formatDistance(distanceKm)}
            unit="km"
          />
          <StatCard
            label="最高速度"
            value={formatSpeed(maxSpeedKmh)}
            unit="km/h"
          />
          <StatCard
            label="移動時間"
            value={formatElapsedTime(elapsedMs)}
          />
        </View>

        {story ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ストーリー</Text>
            <Text style={styles.story}>{story}</Text>
          </View>
        ) : null}

        {tags.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>タグ</Text>
            <View style={styles.tagsRow}>
              {tags.map((tag) => (
                <Text key={tag} style={styles.tag}>
                  #{tag.replace(/^#+/, "")}
                </Text>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  story: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    backgroundColor: COLORS.gpsBadgeBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
  },
});

export default RecordingMapScreen;
