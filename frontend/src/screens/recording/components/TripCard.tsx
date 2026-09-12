import { View, Text, Pressable, StyleSheet } from "react-native";
import Card from "../../../components/Card";
import { COLORS } from "../constants";
import type { TripRecord } from "../types";
import {
  formatDateTime,
  formatDistance,
  formatElapsedTime,
  formatSpeed,
} from "../utils";

type TripCardProps = {
  trip: TripRecord;
  onPress: () => void;
};

function TripCard({ trip, onPress }: TripCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <Text style={styles.date}>{formatDateTime(trip.startedAt)}</Text>
        {trip.story ? (
          <Text style={styles.story} numberOfLines={2}>
            {trip.story}
          </Text>
        ) : (
          <Text style={styles.storyPlaceholder}>移動記録</Text>
        )}
        <View style={styles.statsRow}>
          <Text style={styles.stat}>
            {formatDistance(trip.distanceKm)} km
          </Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.stat}>
            最高 {formatSpeed(trip.maxSpeedKmh)} km/h
          </Text>
          {trip.elapsedMs != null ? (
            <>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.stat}>
                {formatElapsedTime(trip.elapsedMs)}
              </Text>
            </>
          ) : null}
        </View>
        {trip.tags && trip.tags.length > 0 ? (
          <Text style={styles.tags} numberOfLines={1}>
            {trip.tags.map((tag) => `#${tag}`).join(" ")}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: COLORS.white,
    gap: 6,
  },
  date: {
    fontSize: 12,
    color: COLORS.label,
  },
  story: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  storyPlaceholder: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  stat: {
    fontSize: 13,
    color: COLORS.label,
  },
  dot: {
    fontSize: 13,
    color: COLORS.border,
  },
  tags: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 2,
  },
});

export default TripCard;
