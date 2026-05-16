import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { toast } from "sonner-native";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type Agent = {
  id: string;
  coordinate: [number, number];
  name?: string;
};

interface RouteMapProps {
  start?: [number, number];
  end?: [number, number];
  agents?: Agent[];
  autoFetch?: boolean;
}

const MAP_TYPES = ["standard", "satellite", "hybrid", "terrain"] as const;

const toGoogleCoord = (coord: [number, number]): Coordinate => ({
  latitude: coord[1],
  longitude: coord[0],
});

const RouteMap: React.FC<RouteMapProps> = ({
  start,
  end,
  agents = [],
  autoFetch = true,
}) => {
  const mapRef = useRef<MapView>(null);

  const [route, setRoute] = useState<Coordinate[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [mapCenter, setMapCenter] = useState<Coordinate | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isPermissionPending, setIsPermissionPending] = useState(false);
  const [mapType, setMapType] = useState<(typeof MAP_TYPES)[number]>("terrain");
  const [mapModalVisible, setMapModalVisible] = useState(false);

  // POPUP STATE
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const hasRouteMode = !!start && !!end;
  const hasAgentsMode = agents.length > 0 && !hasRouteMode;

  // =========================
  // LOCATION
  // =========================
  const goToMyLocation = async () => {
    try {
      setIsPermissionPending(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        toast.error("Location permission denied");
        setHasPermission(false);
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

      mapRef.current?.animateToRegion(
        {
          ...coords,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000,
      );

      toast.success("Location fetched");
    } catch (error) {
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
      setLoadingRoute(true);

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`,
      );

      const data = await response.json();

      if (!data?.routes?.length) {
        toast.error("No route found");
        return;
      }

      const coords: Coordinate[] = data.routes[0].geometry.coordinates.map(
        (c: number[]) => ({
          longitude: c[0],
          latitude: c[1],
        }),
      );

      setRoute(coords);
      toast.success("Route fetched successfully");

      // FIX: Added a tiny timeout delay so the map layout finishes rendering
      // the polyline nodes before triggering fitToCoordinates.
      if (coords.length > 0) {
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(coords, {
            edgePadding: {
              top: 100,
              right: 50,
              bottom: 100,
              left: 50,
            },
            animated: true,
          });
        }, 150);
      }
    } catch (error) {
      console.log(error);
      toast.error("Route fetch failed" + JSON.stringify(error));
    } finally {
      setLoadingRoute(false);
    }
  }, [start, end]);

  useEffect(() => {
    if (autoFetch && hasRouteMode) {
      fetchRoute();
    }
  }, [fetchRoute, autoFetch, hasRouteMode]);

  // =========================
  // INITIAL REGION
  // =========================
  const initialRegion: Region = useMemo(() => {
    const base = mapCenter
      ? mapCenter
      : start
        ? toGoogleCoord(start)
        : agents.length > 0
          ? toGoogleCoord(agents[0].coordinate)
          : {
              latitude: 23.8103,
              longitude: 90.4125,
            };

    return {
      ...base,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    // FIX: Removed mapCenter and agents from dependencies to prevent unintended map resetting layout updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // POPUP OPEN
  // =========================
  const openPopup = (title: string, description: string) => {
    setPopupData({ title, description });
    setPopupVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType={mapType}
        initialRegion={initialRegion}>
        {/* ROUTE - Rendered only when coordinates exist */}
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeColor="#8b5cf6"
            strokeWidth={5}
            geodesic={true}
          />
        )}

        {/* START */}
        {start && (
          <Marker
            coordinate={toGoogleCoord(start)}
            onPress={() =>
              openPopup("Pickup Location", "This is the starting point.")
            }>
            <View style={styles.markerContainer}>
              <View style={[styles.iconBox, { backgroundColor: "#10B981" }]}>
                <Ionicons name="location" size={20} color="white" />
              </View>
              <View style={styles.triangle} />
            </View>
          </Marker>
        )}

        {/* END */}
        {end && (
          <Marker
            coordinate={toGoogleCoord(end)}
            onPress={() =>
              openPopup("Destination", "This is the delivery destination.")
            }>
            <View style={[styles.iconBox, { backgroundColor: "orange" }]}>
              <Ionicons
                name="cube"
                size={18}
                color={COLORS.surface || "#fff"}
              />
            </View>
          </Marker>
        )}

        {/* AGENTS */}
        {hasAgentsMode &&
          agents.map((agent) => (
            <Marker
              key={agent.id}
              coordinate={toGoogleCoord(agent.coordinate)}
              onPress={() =>
                openPopup(
                  agent.name || "Delivery Agent",
                  `Agent ID: ${agent.id}`,
                )
              }>
              <View style={[styles.iconBox, { backgroundColor: "#3B82F6" }]}>
                <Ionicons name="bicycle" size={20} color="white" />
              </View>
            </Marker>
          ))}

        {/* USER */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            onPress={() =>
              openPopup("Your Location", "You are currently here.")
            }>
            <View style={styles.userDot} />
          </Marker>
        )}
      </MapView>

      {/* ROUTE LOADER */}
      {loadingRoute && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* MY LOCATION BUTTON */}
      <View style={styles.buttonContainer}>
        <Pressable onPress={goToMyLocation} style={styles.floatButton}>
          {isPermissionPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="location-sharp" size={22} color="white" />
          )}
        </Pressable>
      </View>

      {/* MAP TYPE BUTTON */}
      <View style={styles.mapTypeContainer}>
        <Pressable
          onPress={() => setMapModalVisible(true)}
          style={styles.floatButton}>
          <Ionicons name="map-outline" size={22} color="white" />
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
            <Text style={styles.modalTitle}>Select Map Type</Text>
            {MAP_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.option,
                  mapType === type && { backgroundColor: "#f3f4f6" },
                ]}
                onPress={() => {
                  setMapType(type);
                  setMapModalVisible(false);
                }}>
                <Text style={styles.optionText}>{type.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* CUSTOM POPUP */}
      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}>
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>{popupData?.title}</Text>
            <Text style={styles.popupDescription}>
              {popupData?.description}
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setPopupVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RouteMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  buttonContainer: { position: "absolute", right: 16, bottom: 120 },
  mapTypeContainer: { position: "absolute", right: 16, bottom: 185 },
  floatButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  markerContainer: { alignItems: "center" },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 5,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
    marginTop: -1,
  },
  userDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#3B82F6",
    borderWidth: 3,
    borderColor: "#fff",
  },
  loader: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    borderRadius: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 14 },
  option: { paddingVertical: 14, borderRadius: 10, paddingHorizontal: 12 },
  optionText: { fontSize: 15, fontWeight: "600" },
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  popupBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  popupTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  popupDescription: { fontSize: 15, color: "#4B5563", lineHeight: 22 },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
