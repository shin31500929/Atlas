import { View, Text, StyleSheet } from "react-native";
import type { GeoPoint, LatLng } from "../types";
import { COLORS } from "../constants";

type RecordingMapProps = {
  route: GeoPoint[];
  goalLocation?: LatLng;
};

function RecordingMap({ route, goalLocation }: RecordingMapProps) {
  if (route.length === 0 && !goalLocation) {
    return <View style={[styles.container, styles.placeholder]} />;
  }

  return (
    <View style={[styles.container, styles.placeholder]}>
      <Text style={styles.title}>地図プレビュー</Text>
      <Text style={styles.detail}>
        Web では react-native-maps は未対応です（{route.length} 地点）
      </Text>
      {goalLocation ? (
        <Text style={styles.detail}>
          目的地: {goalLocation.latitude.toFixed(4)},{" "}
          {goalLocation.longitude.toFixed(4)}
        </Text>
      ) : null}
      <Text style={styles.hint}>iOS / Android でルートを確認してください</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 6,
  },
  placeholder: {
    backgroundColor: COLORS.mapPlaceholder,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  detail: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: "center",
  },
  hint: {
    fontSize: 12,
    color: COLORS.border,
    textAlign: "center",
  },
});

export default RecordingMap;
