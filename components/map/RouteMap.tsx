import { useGetRouteCoordinatesMutation } from "@/redux/api/createDelivery";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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

  const [isMapReady, setIsMapReady] = useState(false);

  const defalutRoute: Coordinate[] =
    start && end
      ? [
          { latitude: start?.[1], longitude: start?.[0] },
          { latitude: end?.[1], longitude: end?.[0] },
        ]
      : [];

  const [route, setRoute] = useState<Coordinate[]>(defalutRoute);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [mapCenter, setMapCenter] = useState<Coordinate | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isPermissionPending, setIsPermissionPending] = useState(false);
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
    if (isCurrentLocationCentered) {
      initialRegion && mapRef.current?.animateToRegion(initialRegion, 1000);

      setIsCurrentLocationCentered(false);
      return;
    }

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

      setIsCurrentLocationCentered(true);
      toast.success("Location fetched");
    } catch (error) {
      toast.error("Unable to fetch location");
    } finally {
      setIsPermissionPending(false);
    }
  };

  // =========================
  // FIT START/END (FIXED)
  // =========================
  const fitStartEnd = () => {
    if (!isMapReady) return;
    if (!mapRef.current || !start || !end) return;

    const coords = [toGoogleCoord(start), toGoogleCoord(end)];

    requestAnimationFrame(() => {
      mapRef.current?.fitToCoordinates(coords, {
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

  // =========================
  // ROUTE FETCH (FIXED)
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

      if (coords.length > 2) {
        setRoute(coords);
      }

      if (coords.length > 0 && isMapReady) {
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
  // INITIAL REGION (UNCHANGED LOGIC)
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType={mapType}
        initialRegion={isMapReady ? undefined : initialRegion}
        onMapReady={() => setIsMapReady(true)}>
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeColor="#8b5cf6"
            strokeWidth={5}
            geodesic
          />
        )}

        {start && (
          <Marker coordinate={toGoogleCoord(start)}>
            <View style={styles.markerContainer}>
              <View style={[styles.iconBox, { backgroundColor: "#10B981" }]}>
                <Ionicons name="location" size={20} color="white" />
              </View>
              <View style={styles.triangle} />
            </View>
          </Marker>
        )}

        {end && (
          <Marker coordinate={toGoogleCoord(end)}>
            <View style={[styles.iconBox, { backgroundColor: "orange" }]}>
              <Ionicons name="cube" size={18} color="#fff" />
            </View>
          </Marker>
        )}

        {hasAgentsMode &&
          agents.map((agent) => (
            <Marker key={agent.id} coordinate={toGoogleCoord(agent.coordinate)}>
              <View style={[styles.iconBox, { backgroundColor: "#3B82F6" }]}>
                <Ionicons name="bicycle" size={20} color="white" />
              </View>
            </Marker>
          ))}

        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={styles.userDot} />
          </Marker>
        )}
      </MapView>

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
