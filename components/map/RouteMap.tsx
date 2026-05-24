import { useGetRouteCoordinatesMutation } from "@/redux/api/createDelivery";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

const MAP_TYPES = ["standard", "hybrid", "terrain"] as const;

const MAP_TYPE_LABELS: Record<(typeof MAP_TYPES)[number], string> = {
  standard: "Map",
  hybrid: "Street + Satellite",
  terrain: "Terrain",
};

const MIN_DELTA = 0.005;

const toGoogleCoord = (coord: [number, number]): Coordinate => ({
  latitude: coord[1],
  longitude: coord[0],
});

const areCoordinatesTooClose = (
  a: Coordinate,
  b: Coordinate,
  threshold = 0.00005,
) => {
  return (
    Math.abs(a.latitude - b.latitude) < threshold &&
    Math.abs(a.longitude - b.longitude) < threshold
  );
};

const offsetCoordinate = (coord: Coordinate, offset = 0.00012): Coordinate => ({
  latitude: coord.latitude + offset,
  longitude: coord.longitude + offset,
});

const RouteMap: React.FC<RouteMapProps> = ({
  start,
  end,
  agents = [],
  autoFetch = true,
}) => {
  const mapRef = useRef<MapView>(null);

  const [isMapReady, setIsMapReady] = useState(false);

  const defaultRoute: Coordinate[] =
    start && end
      ? [
          { latitude: start[1], longitude: start[0] },
          { latitude: end[1], longitude: end[0] },
        ]
      : [];

  const [route, setRoute] = useState<Coordinate[]>(defaultRoute);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [mapCenter, setMapCenter] = useState<Coordinate | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [mapType, setMapType] = useState<(typeof MAP_TYPES)[number]>("terrain");
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [isCurrentLocationCentered, setIsCurrentLocationCentered] =
    useState(false);

  const [getRouteCoordinates] = useGetRouteCoordinatesMutation();

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
    if (!hasPermission) return; // ⛔ do nothing if denied

    if (isCurrentLocationCentered && initialRegion) {
      mapRef.current?.animateToRegion(initialRegion, 1000);
      setIsCurrentLocationCentered(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);

      mapRef.current?.animateToRegion(
        {
          ...coords,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000,
      );

      setIsCurrentLocationCentered(true);
    } catch {
      toast.error("Unable to fetch location");
    }
  };

  // =========================
  // FIT START/END
  // =========================
  const fitStartEnd = () => {
    if (!isMapReady) return;
    if (!mapRef.current || !start || !end) return;

    const startCoord = toGoogleCoord(start);
    const endCoord = toGoogleCoord(end);

    const isTooClose = areCoordinatesTooClose(startCoord, endCoord);

    if (isTooClose) {
      mapRef.current.animateToRegion(
        {
          latitude: startCoord.latitude,
          longitude: startCoord.longitude,
          latitudeDelta: MIN_DELTA,
          longitudeDelta: MIN_DELTA,
        },
        500,
      );

      return;
    }

    requestAnimationFrame(() => {
      mapRef.current?.fitToCoordinates([startCoord, endCoord], {
        edgePadding: {
          top: 120,
          right: 80,
          bottom: 120,
          left: 80,
        },
        animated: true,
      });
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      setHasPermission(true);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);
      setMapCenter(coords);
      setIsCurrentLocationCentered(true);
    })();
  }, []);

  // =========================
  // ROUTE FETCH
  // =========================
  const fetchRoute = async () => {
    if (!start || !end) return;

    try {
      setLoadingRoute(true);

      const response = await getRouteCoordinates({
        start,
        end,
      }).unwrap();

      if (!response?.coordinates || response.coordinates.length === 0) {
        toast.error("No route found");
        return;
      }

      const coords = response.coordinates.map((c) => ({
        longitude: c.longitude,
        latitude: c.latitude,
      }));

      if (coords.length > 1) {
        setRoute(coords);
      }

      if (coords.length > 0 && isMapReady) {
        const startCoord = coords[0];
        const endCoord = coords[coords.length - 1];

        const isTooClose = areCoordinatesTooClose(startCoord, endCoord);

        if (isTooClose) {
          mapRef.current?.animateToRegion(
            {
              latitude: startCoord.latitude,
              longitude: startCoord.longitude,
              latitudeDelta: MIN_DELTA,
              longitudeDelta: MIN_DELTA,
            },
            500,
          );
        } else {
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
      }
    } catch (error) {
      toast.error("Failed to fetch route");
    } finally {
      setLoadingRoute(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  useEffect(() => {
    fitStartEnd();
  }, [start, end, isMapReady]);

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
  }, []);

  // =========================
  // POPUP
  // =========================
  const openPopup = (title: string, description: string) => {
    setPopupData({ title, description });
    setPopupVisible(true);
  };

  const startCoordinate =
    start && end
      ? areCoordinatesTooClose(toGoogleCoord(start), toGoogleCoord(end))
        ? offsetCoordinate(toGoogleCoord(start), -0.00008)
        : toGoogleCoord(start)
      : undefined;

  const endCoordinate =
    start && end
      ? areCoordinatesTooClose(toGoogleCoord(start), toGoogleCoord(end))
        ? offsetCoordinate(toGoogleCoord(end), 0.00008)
        : toGoogleCoord(end)
      : undefined;

  const shouldShowPolyline =
    route.length > 1 &&
    !(
      start &&
      end &&
      areCoordinatesTooClose(toGoogleCoord(start), toGoogleCoord(end))
    );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType={mapType}
        initialRegion={isMapReady ? undefined : initialRegion}
        onMapReady={() => setIsMapReady(true)}>
        {shouldShowPolyline && (
          <Polyline
            coordinates={route}
            strokeColor="#8b5cf6"
            strokeWidth={5}
            geodesic
          />
        )}

        {start && startCoordinate && (
          <Marker coordinate={startCoordinate}>
            <View style={{ ...styles.markerContainer, zIndex: 20 }}>
              <View style={[styles.iconBox, { backgroundColor: "#10B981" }]}>
                <Ionicons name="location" size={22} color="white" />
              </View>
              <View style={styles.triangle} />
            </View>
          </Marker>
        )}

        {end && endCoordinate && (
          <Marker coordinate={endCoordinate}>
            <View style={[styles.iconBox, { backgroundColor: "orange" }]}>
              <Ionicons name="cube" size={22} color="#fff" />
            </View>
          </Marker>
        )}

        {hasAgentsMode &&
          agents.map((agent) => (
            <Marker key={agent.id} coordinate={toGoogleCoord(agent.coordinate)}>
              <View style={[styles.iconBox, { backgroundColor: "#3B82F6" }]}>
                <Ionicons name="bicycle" size={22} color="white" />
              </View>
            </Marker>
          ))}

        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={styles.userDot} />
          </Marker>
        )}
      </MapView>
      <View style={styles.mapTypeContainer}>
        <Pressable
          style={styles.floatButton}
          onPress={() => setMapModalVisible(true)}>
          <Ionicons name="layers" size={22} color="white" />
        </Pressable>
      </View>

      {hasPermission && (
        <View style={styles.buttonContainer}>
          <Pressable style={styles.floatButton} onPress={goToMyLocation}>
            <Ionicons name="locate" size={22} color="white" />
          </Pressable>
        </View>
      )}

      <Modal
        visible={mapModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMapModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMapModalVisible(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Map Type</Text>

            {MAP_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.option,
                  mapType === type && { backgroundColor: "#E5E7EB" },
                ]}
                onPress={() => {
                  setMapType(type);
                  setMapModalVisible(false);
                }}>
                <Text style={styles.optionText}>{MAP_TYPE_LABELS[type]}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {loadingRoute && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
};

export default RouteMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  buttonContainer: {
    position: "absolute",
    right: 16,
    bottom: 120,
  },

  mapTypeContainer: {
    position: "absolute",
    right: 16,
    bottom: 185,
  },

  floatButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  markerContainer: {
    alignItems: "center",
    zIndex: 10,
  },

  iconBox: {
    width: 34,
    height: 34,
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

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  option: {
    paddingVertical: 14,
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  optionText: {
    fontSize: 15,
    fontWeight: "600",
  },

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

  popupTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  popupDescription: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },

  closeButton: {
    marginTop: 20,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  closeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
