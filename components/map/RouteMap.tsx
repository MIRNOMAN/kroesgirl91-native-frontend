import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { toast } from "sonner-native";

type Coordinate = {
  latitude: number;
  longitude: number;
};

const toGoogleCoord = (coord: [number, number]): Coordinate => ({
  latitude: coord[1],
  longitude: coord[0],
});

type Agent = {
  id: string;
  coordinate: [number, number];
};

interface RouteMapProps {
  start?: [number, number];
  end?: [number, number];
  agents?: Agent[];
  autoFetch?: boolean;
}

const MAP_TYPES = ["standard", "satellite", "hybrid", "terrain"] as const;

const RouteMap: React.FC<RouteMapProps> = ({
  start,
  end,
  agents = [],
  autoFetch = true,
}) => {
  const [route, setRoute] = useState<Coordinate[] | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinate | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isPermissionPending, setIsPermissionPending] = useState(false);

  // ✅ MAP TYPE STATE (ADDED ONLY)
  const [mapType, setMapType] = useState<(typeof MAP_TYPES)[number]>("terrain");

  const [mapModalVisible, setMapModalVisible] = useState(false);

  const hasRouteMode = !!start && !!end;
  const hasAgentsMode = agents.length > 0 && !hasRouteMode;

  // =========================
  // LOCATION
  // =========================
  const goToMyLocation = async () => {
    setIsPermissionPending(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermission(false);
        toast.error("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);
      setMapCenter(coords);
      setHasPermission(true);
    } catch (err) {
      toast.error("Unable to fetch location");
    } finally {
      setIsPermissionPending(false);
    }
  };

  // =========================
  // ROUTE FETCH
  // =========================
  const fetchRoute = useCallback(async () => {
    if (!start || !end) return;

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`,
      );

      const data = await response.json();

      if (!data?.routes?.length) return;

      const coords: Coordinate[] = data?.routes[0].geometry.coordinates.map(
        (c: number[]) => ({
          longitude: c[0],
          latitude: c[1],
        }),
      );

      setRoute(coords);
    } catch (err) {
      console.error(err);
    }
  }, [start, end]);

  useEffect(() => {
    if (autoFetch && hasRouteMode) fetchRoute();
  }, [fetchRoute, autoFetch, hasRouteMode]);

  // =========================
  // REGION
  // =========================
  const initialRegion = useMemo(() => {
    const base = mapCenter
      ? mapCenter
      : start
        ? toGoogleCoord(start)
        : agents.length > 0
          ? toGoogleCoord(agents[0].coordinate)
          : { latitude: 23.8103, longitude: 90.4125 };

    return {
      ...base,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [start, agents, mapCenter]);

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        provider={PROVIDER_GOOGLE}
        mapType={mapType} // ✅ ONLY ADDITION
        style={styles.map}
        initialRegion={initialRegion}
        region={
          mapCenter
            ? { ...mapCenter, latitudeDelta: 0.05, longitudeDelta: 0.05 }
            : undefined
        }>
        {/* ROUTE */}
        {hasRouteMode && route && (
          <Polyline
            coordinates={
              route ?? [
                {
                  latitude: start[1],
                  longitude: start[0],
                },
              ]
            }
            strokeColor="#8b5cf6"
            strokeWidth={4}
          />
        )}

        {/* START */}
        {hasRouteMode && start && (
          <Marker coordinate={toGoogleCoord(start)}>
            <View style={styles.markerContainer}>
              <View style={[styles.iconBox, { backgroundColor: "#10B981" }]}>
                <Ionicons name="location" size={20} color="white" />
              </View>
              <View style={styles.triangle} />
            </View>
          </Marker>
        )}

        {/* END */}
        {hasRouteMode && end && (
          <Marker coordinate={toGoogleCoord(end)}>
            <View style={styles.iconBox}>
              <Ionicons name="cube" size={18} color={COLORS.surface} />
            </View>
          </Marker>
        )}

        {/* AGENTS */}
        {hasAgentsMode &&
          agents.map((agent) => (
            <Marker key={agent.id} coordinate={toGoogleCoord(agent.coordinate)}>
              <View style={styles.iconBox}>
                <Ionicons name="bicycle" size={20} color="white" />
              </View>
            </Marker>
          ))}

        {/* USER */}
        {hasPermission && userLocation && (
          <Marker coordinate={userLocation}>
            <View style={styles.userDot} />
          </Marker>
        )}
      </MapView>

      {/* LOCATION BUTTON */}
      <View style={styles.buttonContainer}>
        {isPermissionPending ? (
          <View style={styles.floatButton}>
            <Ionicons name="hourglass-outline" size={20} color={"white"} />
          </View>
        ) : (
          <Pressable onPress={goToMyLocation} style={styles.floatButton}>
            <Ionicons name="location-sharp" size={22} color={"white"} />
          </Pressable>
        )}
      </View>

      {/* MAP TYPE BUTTON */}
      <View style={styles.mapTypeContainer}>
        <Pressable
          onPress={() => setMapModalVisible(true)}
          style={styles.floatButton}>
          <Ionicons name="map-outline" size={22} color={"white"} />
        </Pressable>
      </View>

      {/* MAP TYPE MODAL */}
      <Modal
        visible={mapModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMapModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {MAP_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => {
                  setMapType(type);
                  setMapModalVisible(false);
                }}
                style={styles.option}>
                <Text>{type.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RouteMap;

/**
 * =========================
 * STYLES (UNCHANGED UI)
 * =========================
 */
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  buttonContainer: {
    position: "absolute",
    right: 16,
    bottom: 120,
  },

  floatButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  mapTypeContainer: {
    position: "absolute",
    right: 16,
    bottom: 185,
  },

  markerContainer: { alignItems: "center" },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 5,
    backgroundColor: "orange",
  },

  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
    transform: [{ rotate: "180deg" }],
    marginTop: -2,
  },

  userDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#3B82F6",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
  },

  option: {
    padding: 12,
  },
});
