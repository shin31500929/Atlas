import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../../components/Header";
import Button from "../../components/Button";
import type RootStackParamList from "../../navigation/type";
import DestinationSetupMap from "./components/DestinationSetupMap";
import { COLORS } from "./constants";
import type { LatLng } from "./types";

type Props = NativeStackScreenProps<RootStackParamList, "DestinationSetup">;

function DestinationSetupScreen({ navigation }: Props) {
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!mounted) {
        return;
      }

      if (status !== "granted") {
        setError("位置情報の許可が必要です。設定から許可してください。");
        setLoading(false);
        return;
      }

      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!mounted) {
          return;
        }
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch {
        if (mounted) {
          // シミュレータ等で取得失敗しても地図は出す
          setError("現在地の取得に失敗しました。地図は表示できます。");
          setCurrentLocation({
            latitude: 35.6812,
            longitude: 139.7671,
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const handleStart = () => {
    if (!destination) {
      return;
    }

    navigation.navigate("Recording", {
      destination,
      startLocation: currentLocation ?? undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Header
        title="目的地を設定"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.mapArea}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={COLORS.primary} size="large" />
            <Text style={styles.hint}>現在地を取得しています...</Text>
          </View>
        ) : (
          <DestinationSetupMap
            currentLocation={currentLocation}
            destination={destination}
            onSelectDestination={setDestination}
          />
        )}
      </View>

      <View style={styles.footer}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.hint}>
          {destination
            ? "赤いピンが目的地です。位置を直す場合は地図をタップするか、ピンをドラッグしてください。"
            : "地図をタップして、赤いピンを目的地に立ててください"}
        </Text>
        <Button
          text="記録を開始"
          onPress={handleStart}
          buttonColor={destination ? COLORS.primary : COLORS.border}
          textColor={COLORS.white}
          style={[
            styles.startButton,
            !destination ? styles.startButtonDisabled : null,
          ]}
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
  mapArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: COLORS.mapPlaceholder,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  hint: {
    fontSize: 13,
    color: COLORS.label,
    textAlign: "center",
    lineHeight: 18,
  },
  error: {
    fontSize: 13,
    color: COLORS.stop,
    textAlign: "center",
  },
  startButton: {
    width: "100%",
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
});

export default DestinationSetupScreen;
