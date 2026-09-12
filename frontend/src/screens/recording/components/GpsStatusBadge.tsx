import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { GpsStatus } from "../types";

type GpsStatusBadgeProps = {
  status: GpsStatus;
};

const STATUS_LABEL: Record<GpsStatus, string> = {
  idle: "GPS待機中",
  acquiring: "GPS取得中",
  active: "GPS取得中",
  denied: "GPS権限なし",
};

function GpsStatusBadge({ status }: GpsStatusBadgeProps) {
  const isDenied = status === "denied";
  const dotColor = isDenied ? COLORS.gpsDenied : COLORS.gpsActive;
  const backgroundColor = isDenied ? "#FFEBEE" : COLORS.gpsBadgeBg;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.label, isDenied && styles.deniedLabel]}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    color: COLORS.text,
  },
  deniedLabel: {
    color: COLORS.gpsDenied,
  },
});

export default GpsStatusBadge;
