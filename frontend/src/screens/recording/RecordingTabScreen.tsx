import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "../../components/Button";
import TripCard from "../recording/components/TripCard";
import { COLORS } from "../recording/constants";
import { getTrips } from "../recording/storage/tripStorage";
import type { TripRecord } from "../recording/types";
import type RootStackParamList from "../../navigation/type";
import type TabParamList from "../../navigation/TabType";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Recording">,
  NativeStackScreenProps<RootStackParamList>
>;

function RecordingTabScreen({ navigation }: Props) {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        setLoading(true);
        try {
          const saved = await getTrips();
          if (active) {
            setTrips(saved);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };
      load();
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          text="目的地を設定して記録を開始"
          onPress={() => navigation.navigate("DestinationSetup")}
          buttonColor={COLORS.primary}
          textColor={COLORS.white}
          iconName="map-marker-radius"
          style={styles.button}
        />
      </View>

      <Text style={styles.sectionTitle}>移動記録</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : trips.length === 0 ? (
        <Text style={styles.empty}>
          まだ記録がありません。{"\n"}
          目的地を設定して移動を記録しましょう。
        </Text>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => navigation.navigate("RecordingMap", { trip })}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 16,
  },
  button: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    fontSize: 13,
    color: COLORS.label,
    lineHeight: 20,
    textAlign: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
});

export default RecordingTabScreen;
