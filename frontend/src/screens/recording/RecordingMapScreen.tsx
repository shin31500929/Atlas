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

        {trip?.story ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ストーリー</Text>
            <Text style={styles.story}>{trip.story}</Text>
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
});

export default RecordingMapScreen;
