import { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import type { LatLng } from "../types";
import { COLORS, DEFAULT_TOKYO } from "../constants";

type DestinationSetupMapProps = {
  currentLocation: LatLng | null;
  destination: LatLng | null;
  onSelectDestination: (coord: LatLng) => void;
  /** false のときは端末GPSの青ドットを隠し、緑ピンで現在地を示す */
  showDeviceUserLocation?: boolean;
};

const DEFAULT_REGION = {
  latitude: DEFAULT_TOKYO.latitude,
  longitude: DEFAULT_TOKYO.longitude,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function DestinationSetupMap({
  currentLocation,
  destination,
  onSelectDestination,
  showDeviceUserLocation = true,
}: DestinationSetupMapProps) {
  const mapRef = useRef<MapView>(null);
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (!currentLocation || hasCenteredRef.current) {
      return;
    }

    if (
      !Number.isFinite(currentLocation.latitude) ||
      !Number.isFinite(currentLocation.longitude) ||
      Math.abs(currentLocation.latitude) > 90 ||
      Math.abs(currentLocation.longitude) > 180
    ) {
      return;
    }

    hasCenteredRef.current = true;
    mapRef.current?.animateToRegion(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      },
      500,
    );
  }, [currentLocation]);

  const initialRegion =
    currentLocation &&
    Number.isFinite(currentLocation.latitude) &&
    Number.isFinite(currentLocation.longitude)
      ? {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }
      : DEFAULT_REGION;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={showDeviceUserLocation}
        showsMyLocationButton={showDeviceUserLocation}
        onPress={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;
          onSelectDestination({ latitude, longitude });
        }}
      >
        {currentLocation && !showDeviceUserLocation ? (
          <Marker
            coordinate={currentLocation}
            pinColor="green"
            title="現在地"
            description="東京駅付近（シミュレータ補正）"
          />
        ) : null}
        {destination ? (
          <Marker
            coordinate={destination}
            pinColor="red"
            title="目的地"
            description="ドラッグで位置を調整できます"
            draggable
            onDragEnd={(event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              onSelectDestination({ latitude, longitude });
            }}
          />
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mapPlaceholder,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default DestinationSetupMap;
