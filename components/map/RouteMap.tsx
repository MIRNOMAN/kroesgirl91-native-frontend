import { Map, MapMarker, MapRoute } from "@/components/ui/map";
import { Image } from "expo-image";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";

type Coordinate = [number, number];

type Agent = {
  id: string;
  coordinate: Coordinate;
};

interface RouteMapProps {
  start?: Coordinate;
  end?: Coordinate;
  agents?: Agent[];
  autoFetch?: boolean;
}

const RouteMap: React.FC<RouteMapProps> = ({
  start,
  end,
  agents = [],
  autoFetch = true,
}) => {
  const [route, setRoute] = useState<Coordinate[] | null>(null);

  // =========================
  // LOCATION STATE
  // =========================
  const [mapCenter, setMapCenter] = useState<Coordinate | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const hasRouteMode = !!start && !!end;
  const hasAgentsMode = agents.length > 0 && !hasRouteMode;

  // =========================
  // GET CURRENT LOCATION
  // =========================
  const goToMyLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermission(false);
        toast.error("Location permission denied");
        return;
      }

      setHasPermission(true);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords: Coordinate = [
        location.coords.longitude,
        location.coords.latitude,
      ];

      setUserLocation(coords);
      setMapCenter(coords);
    } catch (err) {
      console.log(err);
      setHasPermission(false);
      toast.error("Unable to fetch location");
    }
  };

  // =========================
  // FETCH ROUTE (A → B)
  // =========================
  const fetchRoute = useCallback(async () => {
    if (!start || !end) return;

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`,
      );

      const data = await response.json();

      if (!data?.routes?.length) return;

      const coords: Coordinate[] = data.routes[0].geometry.coordinates.map(
        (c: number[]) => [c[0], c[1]] as Coordinate,
      );

      setRoute(coords);
    } catch (err) {
      console.error("Route fetch failed:", err);
    }
  }, [start, end]);

  useEffect(() => {
    if (autoFetch && hasRouteMode) {
      fetchRoute();
    }
  }, [fetchRoute, autoFetch, hasRouteMode]);

  // =========================
  // CENTER LOGIC
  // =========================
  const center = useMemo(() => {
    if (mapCenter) return mapCenter;
    if (start) return start;
    if (agents.length > 0) return agents[0].coordinate;
    return [90.4125, 23.8103];
  }, [start, agents, mapCenter]) as Coordinate;

  return (
    <View className="h-screen relative">
      {/* ================= MAP ================= */}
      <Map zoom={12} center={center}>
        {/* ROUTE MODE */}
        {hasRouteMode && route && (
          <MapRoute coordinates={route} color="#8b5cf6" width={4} />
        )}

        {hasRouteMode && start && (
          <MapMarker coordinate={start}>
            <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-white text-xs font-bold">A</Text>
            </View>
          </MapMarker>
        )}

        {hasRouteMode && end && (
          <MapMarker coordinate={end}>
            <View className="w-8 h-8 bg-red-500 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-white text-xs font-bold">B</Text>
            </View>
          </MapMarker>
        )}

        {/* ================= AGENTS MODE ================= */}
        {hasAgentsMode &&
          agents.map((agent) => (
            <MapMarker key={agent.id} coordinate={agent.coordinate}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",

                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                <Image
                  source={require("@/assets/tracking/agent_mark.png")}
                  style={{
                    width: 50,
                    height: 50,
                    resizeMode: "contain",
                  }}
                />
              </View>
            </MapMarker>
          ))}

        {/* ================= USER LOCATION ================= */}
        {hasPermission && userLocation && (
          <MapMarker coordinate={userLocation}>
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "#3B82F6",
                borderWidth: 3,
                borderColor: "#fff",

                shadowColor: "#3B82F6",
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 8,
              }}
            />
          </MapMarker>
        )}
      </Map>

      {/* ================= FLOAT BUTTON ================= */}
      <Pressable
        onPress={goToMyLocation}
        style={{
          position: "absolute",
          right: 16,
          bottom: 120,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#111", // dark theme
          alignItems: "center",
          justifyContent: "center",

          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}>
        <Text style={{ fontSize: 20, color: "#fff" }}>📍</Text>
      </Pressable>
    </View>
  );
};

export default RouteMap;
