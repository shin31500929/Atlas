import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import type { GeoPoint, LatLng } from "../types";
import { COLORS } from "../constants";

type RecordingMapProps = {
  route: GeoPoint[];
  goalLocation?: LatLng;
};

function RecordingMap({ route, goalLocation }: RecordingMapProps) {
  if (route.length === 0 && !goalLocation) {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <Text style={styles.placeholderText}>軌跡データがありません</Text>
      </View>
    );
  }

  const coordinates = route.map((point) => ({
    latitude: point.latitude,
    longitude: point.longitude,
  }));

  const points: LatLng[] = [
    ...route,
    ...(goalLocation ? [goalLocation] : []),
  ];

  const latitudes = points.map((p) => p.latitude);
  const longitudes = points.map((p) => p.longitude);

  const region = {
    latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
    longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
    latitudeDelta: Math.max(
      0.02,
      (Math.max(...latitudes) - Math.min(...latitudes)) * 1.5,
    ),
    longitudeDelta: Math.max(
      0.02,
      (Math.max(...longitudes) - Math.min(...longitudes)) * 1.5,
    ),
  };

  const start = route[0];
  const end = route.length > 0 ? route[route.length - 1] : undefined;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {coordinates.length > 1 ? (
          <Polyline
            coordinates={coordinates}
            strokeColor="#2196F3"
            strokeWidth={4}
          />
        ) : null}
        {start ? (
          <Marker
            coordinate={{
              latitude: start.latitude,
              longitude: start.longitude,
            }}
            pinColor="green"
            title="開始"
          />
        ) : null}
        {goalLocation ? (
          <Marker
            coordinate={goalLocation}
            pinColor="red"
            title="目的地"
          />
        ) : end && route.length > 1 ? (
          <Marker
            coordinate={{ latitude: end.latitude, longitude: end.longitude }}
            pinColor="red"
            title="終点"
          />
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    backgroundColor: COLORS.mapPlaceholder,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.label,
  },
});

export default RecordingMap;
