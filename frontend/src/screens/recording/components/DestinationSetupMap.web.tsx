import { View, Text, Pressable, StyleSheet } from "react-native";
import type { LatLng } from "../types";
import { COLORS } from "../constants";

type DestinationSetupMapProps = {
  currentLocation: LatLng | null;
  destination: LatLng | null;
  onSelectDestination: (coord: LatLng) => void;
};

function DestinationSetupMap({
  currentLocation,
  destination,
  onSelectDestination,
}: DestinationSetupMapProps) {
  const demoGoal: LatLng = currentLocation
    ? {
        latitude: currentLocation.latitude + 0.02,
        longitude: currentLocation.longitude + 0.02,
      }
    : { latitude: 35.7012, longitude: 139.7871 };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>現在地マップ（Web）</Text>
      <Text style={styles.detail}>
        Web では地図タップが使えません。下のボタンで目的地ピンを立ててください。
      </Text>
      {currentLocation ? (
        <Text style={styles.coord}>
          現在地: {currentLocation.latitude.toFixed(4)},{" "}
          {currentLocation.longitude.toFixed(4)}
        </Text>
      ) : null}
      {destination ? (
        <Text style={[styles.coord, styles.goal]}>
          目的地（赤ピン）: {destination.latitude.toFixed(4)},{" "}
          {destination.longitude.toFixed(4)}
        </Text>
      ) : (
        <Pressable
          style={styles.demoButton}
          onPress={() => onSelectDestination(demoGoal)}
        >
          <Text style={styles.demoButtonText}>赤いピンを立てる</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mapPlaceholder,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  detail: {
    fontSize: 13,
    color: COLORS.label,
    textAlign: "center",
    lineHeight: 20,
  },
  coord: {
    fontSize: 13,
    color: COLORS.text,
  },
  goal: {
    color: COLORS.stop,
    fontWeight: "600",
  },
  demoButton: {
    marginTop: 8,
    backgroundColor: COLORS.stop,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  demoButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});

export default DestinationSetupMap;
