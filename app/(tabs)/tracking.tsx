import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RouteMap from "@/components/map/RouteMap";
import {
  useGetAllAgentsQuery,
  useOrderByIdQuery,
} from "@/redux/api/createDelivery";

import {
  TripSuccessModal,
  type Coordinate,
} from "../../components/ui/tracking";

/**
 * =========================
 * TYPES
 * =========================
 */
type TrackingState = "tracking" | "driver-arrived" | "completed";

type TrackingParams = {
  ordersId?: string;
  state?: TrackingState;
  mode?: "order" | "agents";
};

/**
 * =========================
 * HELPERS
 * =========================
 */
const distanceKm = (from: Coordinate, to: Coordinate) => {
  const R = 6371;

  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLng = ((to.longitude - from.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.latitude * Math.PI) / 180) *
      Math.cos((to.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
};

/**
 * =========================
 * SCREEN
 * =========================
 */
export default function TrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<TrackingParams>();

  /**
   * =========================
   * MODE (FIXED ✅)
   * =========================
   */
  const isOrderMode = !!params.ordersId;
  const isAgentsMode = !params.ordersId;

  /**
   * RESET ON FOCUS
   */
  const [resetKey, setResetKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setResetKey((prev) => prev + 1);
    }, []),
  );

  /**
   * =========================
   * ORDER DATA
   * =========================
   */
  const { data: orderData } = useOrderByIdQuery(params.ordersId ?? "", {
    skip: !isOrderMode,
  });

  const order = orderData?.data;

  const pickup = useMemo(() => {
    if (!order?.pickupLatitude || !order?.pickupLongitude) return null;
    return {
      latitude: order.pickupLatitude,
      longitude: order.pickupLongitude,
    };
  }, [order]);

  const dropoff = useMemo(() => {
    if (!order?.deliveryLatitude || !order?.deliveryLongitude) return null;
    return {
      latitude: order.deliveryLatitude,
      longitude: order.deliveryLongitude,
    };
  }, [order]);

  /**
   * =========================
   * AGENTS DATA
   * =========================
   */
  const { data: agentsData } = useGetAllAgentsQuery(undefined, {
    skip: !isAgentsMode,
  });

  const agents = useMemo(() => {
    if (!agentsData?.data) return [];

    return agentsData.data
      .filter((a) => a.latitude && a.longitude)
      .map((agent) => ({
        id: agent.id,
        coordinate: [agent.longitude, agent.latitude] as [number, number],
      }));
  }, [agentsData]);

  /**
   * =========================
   * STATE
   * =========================
   */
  const trackingState = (params.state as TrackingState) ?? "tracking";

  const tripDistance = useMemo(() => {
    if (!pickup || !dropoff) return 0;
    return distanceKm(pickup, dropoff);
  }, [pickup, dropoff]);

  const etaText = `${Math.max(12, Math.round(tripDistance * 5))} min`;

  const handleGoHome = () => {
    router.replace("/(tabs)/home");
  };

  const showHeader = trackingState !== "tracking";

  /**
   * =========================
   * LOADING (ORDER ONLY)
   * =========================
   */
  if (isOrderMode && (!pickup || !dropoff)) {
    return (
      <View style={styles.loader}>
        <Text>Loading tracking data...</Text>
      </View>
    );
  }

  /**
   * =========================
   * RENDER
   * =========================
   */
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* HEADER */}
        {showHeader && isOrderMode && (
          <View style={styles.topRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.screenTitle}>Tracking</Text>
              <Text style={styles.screenSubtitle}>{params.ordersId}</Text>
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
        )}

        {/* MAP */}
        {isOrderMode && pickup && dropoff ? (
          <RouteMap
            key={resetKey}
            autoFetch
            start={[pickup.longitude, pickup.latitude]}
            end={[dropoff.longitude, dropoff.latitude]}
          />
        ) : (
          <RouteMap key={resetKey} agents={agents} />
        )}

        {/* MODAL */}
        <TripSuccessModal
          visible={trackingState === "completed" && isOrderMode}
          etaText={`Estimated arrival time: ${etaText}`}
          onGoHome={handleGoHome}
        />
      </View>
    </SafeAreaView>
  );
}

/**
 * =========================
 * STYLES
 * =========================
 */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F8FA" },
  container: { flex: 1, backgroundColor: "#F4F8FA" },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 12,
  },

  titleBlock: { flex: 1 },

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
});
