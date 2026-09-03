import { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import type { LatLng } from "../types";
import { COLORS } from "../constants";

type DestinationSetupMapProps = {
  currentLocation: LatLng | null;
  destination: LatLng | null;
  onSelectDestination: (coord: LatLng) => void;
};

const DEFAULT_REGION = {
  latitude: 35.6812,
  longitude: 139.7671,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function DestinationSetupMap({
  currentLocation,
  destination,
  onSelectDestination,
}: DestinationSetupMapProps) {
  const mapRef = useRef<MapView>(null);
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (!currentLocation || hasCenteredRef.current) {
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

  const initialRegion = currentLocation
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
        showsUserLocation
        showsMyLocationButton
        onPress={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;
          onSelectDestination({ latitude, longitude });
        }}
      >
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
