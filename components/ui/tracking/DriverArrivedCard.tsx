import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { TAgent } from "@/types";

type DriverArrivedCardProps = {
  agent?: TAgent | null;
  vehicleNumber?: string;
  vehicleType?: string;
  onClose?: () => void;
  onMessageDriver?: () => void;
};

export default function DriverArrivedCard({
  agent,
  vehicleNumber,
  vehicleType,
  onClose,
  onMessageDriver,
}: DriverArrivedCardProps) {
  const handleMessageDriver = () => {
    if (onMessageDriver) {
      onMessageDriver();
      return;
    }

    if (agent?.phone) {
      void Linking.openURL(`tel:${agent.phone}`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Driver Arrived</Text>
          <Text style={styles.subtitle}>Driver arrived on your location</Text>
        </View>

        <View style={styles.distanceChip}>
          <Ionicons name="navigate-outline" size={14} color="#F59E0B" />
          <Text style={styles.distanceText}>Live</Text>
        </View>
      </View>

      <View style={styles.vehicleCard}>
        <View style={styles.vehicleIcon}>
          {agent?.fleetThumbImage ? (
            <Image
              source={{ uri: agent.fleetThumbImage }}
              style={styles.avatar}
            />
          ) : (
            <Ionicons name="bicycle-outline" size={22} color="#0F4C5C" />
          )}
        </View>

        <View style={styles.vehicleContent}>
          <Text style={styles.vehicleNumber} numberOfLines={1}>
            {vehicleNumber || agent?.name || "Assigned driver"}
          </Text>
          <Text style={styles.vehicleType} numberOfLines={1}>
            {vehicleType || agent?.transportDesc || "Tookan fleet rider"}
          </Text>

          <View style={styles.driverRow}>
            <Ionicons name="person-circle-outline" size={18} color="#0F4C5C" />
            <Text style={styles.driverName} numberOfLines={1}>
              {agent?.username || agent?.name || "Agent assigned"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleMessageDriver}
        >
          <Text style={styles.secondaryButtonText}>Message Driver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
          <Text style={styles.primaryButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },
  distanceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFF7E6",
    borderRadius: 999,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  vehicleCard: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#FBFDFF",
  },
  vehicleIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EAF4F6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 54,
    height: 54,
  },
  vehicleContent: {
    flex: 1,
    justifyContent: "center",
  },
  vehicleNumber: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  vehicleType: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  driverName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#0F4C5C",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#0F4C5C",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#0F4C5C",
    fontWeight: "700",
    fontSize: 14,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F4C5C",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
});
