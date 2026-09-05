import { useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import type { GeoPoint, LatLng } from "../types";
import { COLORS } from "../constants";

type RecordingMapProps = {
  route: GeoPoint[];
  goalLocation?: LatLng;
};

const DEFAULT_REGION = {
  latitude: 35.6812,
  longitude: 139.7671,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

function isValidCoord(p: { latitude: number; longitude: number }) {
  return (
    Number.isFinite(p.latitude) &&
    Number.isFinite(p.longitude) &&
    Math.abs(p.latitude) <= 90 &&
    Math.abs(p.longitude) <= 180
  );
}

function buildSafeRegion(points: LatLng[]) {
  const valid = points.filter(isValidCoord);
  if (valid.length === 0) {
    return DEFAULT_REGION;
  }

  const latitudes = valid.map((p) => p.latitude);
  const longitudes = valid.map((p) => p.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;

  // MapKit は delta が NaN / 過大 / 0 付近だと setRegion でクラッシュする
  const latitudeDelta = Math.min(
    60,
    Math.max(0.02, (maxLat - minLat) * 1.4 || 0.02),
  );
  const longitudeDelta = Math.min(
    60,
    Math.max(0.02, (maxLng - minLng) * 1.4 || 0.02),
  );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitudeDelta) ||
    !Number.isFinite(longitudeDelta)
  ) {
    return DEFAULT_REGION;
  }

  return { latitude, longitude, latitudeDelta, longitudeDelta };
}

function RecordingMap({ route, goalLocation }: RecordingMapProps) {
  const mapRef = useRef<MapView>(null);

  const coordinates = useMemo(
    () =>
      route
        .filter(isValidCoord)
        .map((point) => ({
          latitude: point.latitude,
          longitude: point.longitude,
        })),
    [route],
  );

  const points: LatLng[] = useMemo(
    () => [
      ...coordinates,
      ...(goalLocation && isValidCoord(goalLocation) ? [goalLocation] : []),
    ],
    [coordinates, goalLocation],
  );

  const region = useMemo(() => buildSafeRegion(points), [points]);

  if (points.length === 0) {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <Text style={styles.placeholderText}>軌跡データがありません</Text>
      </View>
    );
  }

  const start = coordinates[0];
  const end =
    coordinates.length > 0 ? coordinates[coordinates.length - 1] : undefined;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        onMapReady={() => {
          if (coordinates.length > 0) {
            mapRef.current?.fitToCoordinates(coordinates, {
              edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
              animated: false,
            });
          }
        }}
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
          <Marker coordinate={start} pinColor="green" title="開始" />
        ) : null}
        {goalLocation && isValidCoord(goalLocation) ? (
          <Marker coordinate={goalLocation} pinColor="red" title="目的地" />
        ) : end && coordinates.length > 1 ? (
          <Marker coordinate={end} pinColor="red" title="終点" />
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
