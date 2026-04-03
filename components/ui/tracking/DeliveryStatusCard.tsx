import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DeliveryStatusCardProps = {
  title: string;
  subtitle: string;
  dropoffLocation: string;
  etaText: string;
  priceText: string;
  distanceText?: string;
  onMessageDriver?: () => void;
  onClose?: () => void;
};

export default function DeliveryStatusCard({
  title,
  subtitle,
  dropoffLocation,
  etaText,
  priceText,
  distanceText,
  onMessageDriver,
  onClose,
}: DeliveryStatusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{priceText}</Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <View style={styles.locationIcon}>
          <Ionicons name="location-outline" size={16} color="#F59E0B" />
        </View>

        <View style={styles.locationContent}>
          <Text style={styles.locationLabel}>Dropoff Location</Text>
          <Text style={styles.locationValue} numberOfLines={2}>
            {dropoffLocation}
          </Text>
        </View>

        <Text style={styles.locationAmount}>{distanceText || etaText}</Text>
      </View>

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.footerLabel}>ETA</Text>
          <Text style={styles.footerValue}>{etaText}</Text>
        </View>

        <View style={styles.footerActions}>
          <TouchableOpacity
            style={styles.ghostButton}
            onPress={onMessageDriver}
          >
            <Text style={styles.ghostButtonText}>Message Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
            <Text style={styles.primaryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 14,
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
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E8F6F7",
    borderRadius: 999,
  },
  priceText: {
    color: "#0F4C5C",
    fontSize: 13,
    fontWeight: "800",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#F8FBFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  locationIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  locationContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  locationValue: {
    marginTop: 4,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
  },
  locationAmount: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F4C5C",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.4,
  },
  footerValue: {
    marginTop: 4,
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "800",
  },
  footerActions: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    justifyContent: "flex-end",
  },
  ghostButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#0F4C5C",
    alignItems: "center",
    justifyContent: "center",
  },
  ghostButtonText: {
    color: "#0F4C5C",
    fontWeight: "700",
    fontSize: 13,
  },
  primaryButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 13,
    backgroundColor: "#0F4C5C",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
});
