import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGetAllAgentsQuery } from "@/redux/api/createDelivery";
import type { TAgent } from "@/types";

import {
  DeliveryStatusCard,
  DriverArrivedCard,
  TrackingMapView,
  TrackingProgress,
  TripSuccessModal,
  type Coordinate,
  type TrackingMapPoint,
  type TrackingStep,
} from "../../components/ui/tracking";

type TrackingState = "tracking" | "driver-arrived" | "completed";

type TrackingParams = {
  state?: string;
  pickupLat?: string;
  pickupLng?: string;
  dropLat?: string;
  dropLng?: string;
  pickupAddress?: string;
  dropAddress?: string;
  orderId?: string;
  vehicleNumber?: string;
  vehicleType?: string;
};

const DEFAULT_PICKUP: Coordinate = {
  latitude: 23.8103,
  longitude: 90.4125,
};

const DEFAULT_DROPOFF: Coordinate = {
  latitude: 23.8158,
  longitude: 90.4218,
};

const TRACKING_STEPS: TrackingStep[] = [
  { key: "accepted", label: "Accepted", completed: true },
  { key: "picked", label: "Picked", completed: true },
  { key: "transit", label: "In Transit", completed: true },
  { key: "arrived", label: "Driver Arrived", completed: false },
  { key: "delivered", label: "Delivered", completed: false },
];

const parseNumber = (value?: string | string[]) => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const distanceKm = (from: Coordinate, to: Coordinate) => {
  const earthRadius = 6371;
  const latDelta = ((to.latitude - from.latitude) * Math.PI) / 180;
  const lngDelta = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos((from.latitude * Math.PI) / 180) *
      Math.cos((to.latitude * Math.PI) / 180) *
      Math.sin(lngDelta / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
};

const formatDistance = (value: number) =>
  value < 1 ? `${Math.round(value * 1000)} m` : `${value.toFixed(1)} km`;

const toCoordinate = (
  fallback: Coordinate,
  latitude?: string | string[],
  longitude?: string | string[],
): Coordinate => {
  const lat = parseNumber(latitude);
  const lng = parseNumber(longitude);

  if (typeof lat === "number" && typeof lng === "number") {
    return { latitude: lat, longitude: lng };
  }

  return fallback;
};

const getActiveAgent = (
  agents: TAgent[],
  pickup: Coordinate,
): TAgent | null => {
  const validAgents = agents.filter(
    (agent) =>
      typeof agent.latitude === "number" && typeof agent.longitude === "number",
  );

  if (validAgents.length === 0) {
    return agents[0] ?? null;
  }

  return validAgents.reduce((closest, current) => {
    const closestDistance = distanceKm(pickup, {
      latitude: Number(closest.latitude),
      longitude: Number(closest.longitude),
    });
    const currentDistance = distanceKm(pickup, {
      latitude: Number(current.latitude),
      longitude: Number(current.longitude),
    });

    return currentDistance < closestDistance ? current : closest;
  });
};

export default function TrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<TrackingParams>();
  const { data: agentsResponse } = useGetAllAgentsQuery();
  const { height: screenHeight } = useWindowDimensions();

  const trackingState = (params.state as TrackingState) ?? "tracking";
  const pickup = toCoordinate(
    DEFAULT_PICKUP,
    params.pickupLat,
    params.pickupLng,
  );
  const dropoff = toCoordinate(DEFAULT_DROPOFF, params.dropLat, params.dropLng);

  const agents = useMemo(
    () => agentsResponse?.data ?? [],
    [agentsResponse?.data],
  );
  const activeAgent = useMemo(
    () => getActiveAgent(agents, pickup),
    [agents, pickup],
  );

  const activeAgentCoordinate = useMemo<Coordinate | null>(() => {
    if (
      typeof activeAgent?.latitude === "number" &&
      typeof activeAgent?.longitude === "number"
    ) {
      return {
        latitude: Number(activeAgent.latitude),
        longitude: Number(activeAgent.longitude),
      };
    }

    return null;
  }, [activeAgent]);

  const mapPoints: TrackingMapPoint[] = useMemo(() => {
    const points: TrackingMapPoint[] = [
      {
        id: "pickup",
        kind: "pickup",
        title: params.pickupAddress || "Pickup location",
        subtitle: `${pickup.latitude.toFixed(4)}, ${pickup.longitude.toFixed(4)}`,
        ...pickup,
      },
      {
        id: "dropoff",
        kind: "dropoff",
        title: params.dropAddress || "Dropoff location",
        subtitle: `${dropoff.latitude.toFixed(4)}, ${dropoff.longitude.toFixed(4)}`,
        ...dropoff,
      },
    ];

    if (activeAgentCoordinate && activeAgent) {
      points.push({
        id: activeAgent.id,
        kind: "driver",
        title: activeAgent.name,
        subtitle:
          activeAgent.phone || activeAgent.transportDesc || "Assigned driver",
        imageUrl: activeAgent.fleetThumbImage || activeAgent.fleetImage || null,
        ...activeAgentCoordinate,
      });
    }

    return points;
  }, [
    activeAgent,
    activeAgentCoordinate,
    dropoff,
    params.dropAddress,
    params.pickupAddress,
    pickup,
  ]);

  const route = useMemo(() => {
    if (activeAgentCoordinate) {
      return [pickup, activeAgentCoordinate, dropoff];
    }

    return [pickup, dropoff];
  }, [activeAgentCoordinate, dropoff, pickup]);

  const tripDistance = useMemo(
    () => distanceKm(pickup, dropoff),
    [dropoff, pickup],
  );
  const etaText = `${Math.max(12, Math.round(tripDistance * 5))} min`;
  const priceText = "200 USD";

  const trackingSteps = useMemo<TrackingStep[]>(
    () =>
      TRACKING_STEPS.map((step, index) => ({
        ...step,
        completed:
          trackingState === "completed"
            ? true
            : trackingState === "driver-arrived"
              ? index <= 3
              : index <= 2,
      })),
    [trackingState],
  );

  const handleGoHome = () => {
    router.replace("/(tabs)/home");
  };

  const handleMessageDriver = () => {
    if (activeAgent?.phone) {
      void Linking.openURL(`tel:${activeAgent.phone}`);
    }
  };

  const showSectionHeader = trackingState !== "tracking";
  const isTrackingMode = trackingState === "tracking";
  const mapHeight = isTrackingMode
    ? screenHeight
    : Math.max(360, screenHeight * 0.48);

  const [searchQuery, setSearchQuery] = useState(params.pickupAddress || "");
  const [focusCoordinate, setFocusCoordinate] = useState<Coordinate | null>(
    null,
  );

  const handleSearchSubmit = () => {
    const normalized = searchQuery.trim().toLowerCase();

    if (!normalized) {
      setFocusCoordinate(pickup);
      return;
    }

    const matchedPoint = mapPoints.find((point) => {
      const title = point.title?.toLowerCase() || "";
      const subtitle = point.subtitle?.toLowerCase() || "";
      return title.includes(normalized) || subtitle.includes(normalized);
    });

    if (matchedPoint) {
      setFocusCoordinate({
        latitude: matchedPoint.latitude,
        longitude: matchedPoint.longitude,
      });
      return;
    }

    setFocusCoordinate(pickup);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {showSectionHeader ? (
          <View style={styles.topRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.screenTitle}>Tracking</Text>
              <Text style={styles.screenSubtitle} numberOfLines={1}>
                {params.orderId ||
                  activeAgent?.name ||
                  "Live shipment overview"}
              </Text>
            </View>

            <View style={styles.statusChip}>
              <Text style={styles.statusChipText}>
                {trackingState === "driver-arrived"
                  ? "Driver arrived"
                  : trackingState === "completed"
                    ? "Completed"
                    : "Live"}
              </Text>
            </View>
          </View>
        ) : null}

        {isTrackingMode ? (
          <View style={styles.trackingModeContainer}>
            <View style={[styles.mapShell, styles.mapShellFullscreen]}>
              <TrackingMapView
                center={pickup}
                points={mapPoints}
                route={route}
                height={mapHeight}
                focusCoordinate={focusCoordinate}
                controlsBottomOffset={130}
              />

              <View style={styles.mapOverlayTop}>
                <Pressable
                  style={styles.mapBackButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name="chevron-back" size={20} color="#0F172A" />
                </Pressable>

                <View style={styles.searchPill}>
                  <Ionicons name="search" size={18} color="#94A3B8" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search pickup/dropoff/driver"
                    placeholderTextColor="#94A3B8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                  />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {showSectionHeader ? (
              <View style={styles.mapHeadingWrap}>
                <Pressable
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name="chevron-back" size={20} color="#0F172A" />
                </Pressable>

                <Text style={styles.mapHeading}>
                  {trackingState === "driver-arrived"
                    ? "Driver Arrived"
                    : trackingState === "completed"
                      ? "Pick Up"
                      : ""}
                </Text>
              </View>
            ) : null}

            <View style={styles.mapShell}>
              <TrackingMapView
                center={pickup}
                points={mapPoints}
                route={route}
                height={mapHeight}
                controlsBottomOffset={108}
              />

              <View style={styles.mapOverlayTop}>
                {!showSectionHeader ? (
                  <Pressable
                    style={styles.mapBackButton}
                    onPress={() => router.back()}
                  >
                    <Ionicons name="chevron-back" size={20} color="#0F172A" />
                  </Pressable>
                ) : null}

                <View style={styles.searchPill}>
                  <Ionicons name="search" size={18} color="#94A3B8" />
                  <Text style={styles.searchText} numberOfLines={1}>
                    {params.pickupAddress || "I am looking for"}
                  </Text>
                </View>
              </View>
            </View>

            {trackingState === "driver-arrived" ? (
              <>
                <DeliveryStatusCard
                  title="Driver Arrived"
                  subtitle="Driver arrived on your location"
                  dropoffLocation={params.dropAddress || "Dropoff destination"}
                  etaText={etaText}
                  priceText={priceText}
                  distanceText={formatDistance(tripDistance)}
                  onMessageDriver={handleMessageDriver}
                  onClose={() => router.back()}
                />

                <DriverArrivedCard
                  agent={activeAgent}
                  vehicleNumber={
                    params.vehicleNumber ||
                    activeAgent?.username ||
                    "DHM-GA-31-8359"
                  }
                  vehicleType={
                    params.vehicleType ||
                    activeAgent?.transportDesc ||
                    "White Toyota Corolla"
                  }
                  onMessageDriver={handleMessageDriver}
                  onClose={() => router.back()}
                />

                <View style={styles.progressWrap}>
                  <TrackingProgress steps={trackingSteps} />
                </View>
              </>
            ) : null}

            {trackingState === "completed" ? (
              <View style={styles.completedHint}>
                <Text style={styles.completedHintTitle}>Trip completed</Text>
                <Text style={styles.completedHintText}>
                  The completion modal is shown over the live map so the layout
                  matches the design.
                </Text>
              </View>
            ) : null}
          </ScrollView>
        )}

        <TripSuccessModal
          visible={trackingState === "completed"}
          etaText={`Estimated arrival time: ${etaText}`}
          onGoHome={handleGoHome}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F8FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F8FA",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  titleBlock: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  screenSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#64748B",
  },
  mapHeadingWrap: {
    marginHorizontal: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mapHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#0F4C5C",
  },
  statusChipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  scroll: {
    flex: 1,
  },
  trackingModeContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 36,
  },
  mapShell: {
    marginHorizontal: 18,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
    elevation: 5,
  },
  mapShellFullscreen: {
    flex: 1,
    marginHorizontal: 0,
    borderRadius: 0,
    minHeight: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  mapOverlayTop: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
  },
  mapBackButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  searchPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 52,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: 18,
    marginLeft: 50,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    color: "#94A3B8",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
    paddingVertical: 0,
  },
  progressWrap: {
    marginHorizontal: 18,
    marginTop: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
  },
  completedHint: {
    marginTop: 16,
    marginHorizontal: 18,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  completedHintTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  completedHintText: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },
});
