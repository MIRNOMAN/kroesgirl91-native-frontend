import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const { width } = Dimensions.get("window");

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MarkerData {
  id: string;
  coordinate: Coordinate;
  title: string;
  type: string;
}

interface RiderData {
  id: string;
  coordinate: Coordinate;
  name: string;
  type?: string;
  image?: string;
  isAvailable?: number;
}

interface MapConfig {
  apiKey: string;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

interface TrackingMapViewProps {
  mapConfig: MapConfig;
  markers: MarkerData[];
  riders?: RiderData[];
  routeCoordinates?: Coordinate[];
  searchPlaceholder?: string;
  onBackPress?: () => void;
  onRiderPress?: (rider: RiderData) => void;
  showSearchBar?: boolean;
  showRoute?: boolean;
  showRiders?: boolean;
}

const getMarkerColor = (type: string) => {
  switch (type) {
    case "current":
      return "#FFB800";
    case "pickup":
      return "#003C52";
    case "delivery":
      return "#003C52";
    default:
      return "#003C52";
  }
};

export default function TrackingMapView({
  mapConfig,
  markers,
  riders = [],
  routeCoordinates = [],
  searchPlaceholder = "I am looking for",
  onBackPress,
  onRiderPress,
  showSearchBar = true,
  showRoute = false,
  showRiders = false,
}: TrackingMapViewProps) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapConfig.initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
          >
            <View
              style={[
                styles.markerContainer,
                { backgroundColor: getMarkerColor(marker.type) },
              ]}
            >
              <Ionicons
                name={
                  marker.type === "current"
                    ? "person"
                    : marker.type === "pickup"
                      ? "location"
                      : "flag"
                }
                size={16}
                color="#FFFFFF"
              />
            </View>
          </Marker>
        ))}

        {/* Live Riders */}
        {showRiders &&
          riders.map((rider) => (
            <Marker
              key={rider.id}
              coordinate={rider.coordinate}
              title={rider.name}
              onPress={() => onRiderPress?.(rider)}
            >
              <View
                style={[
                  styles.riderMarker,
                  {
                    borderColor: rider.isAvailable ? "#FFD600" : "#ccc",
                    borderWidth: 4,
                    backgroundColor: "#fff",
                  },
                ]}
              >
                <Image
                  source={{ uri: rider.image }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                  resizeMode="cover"
                />
              </View>
            </Marker>
          ))}

        {showRoute && routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#003C52"
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color="#003C52" />
      </TouchableOpacity>

      {/* Search Bar */}
      {showSearchBar && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#A0A0A0" />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 70,
    left: 16,
    right: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: width > 400 ? 16 : 14,
    color: "#333333",
    marginLeft: 12,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  riderMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFB800",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
