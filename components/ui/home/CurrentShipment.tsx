import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";

interface ShipmentStatus {
  image: string;
  label: string;
  active: boolean;
}

interface CurrentShipmentProps {
  recipientName: string;
  recipientAvatar?: string;
  trackingId?: string;
  status: string;
  statuses: ShipmentStatus[];
  startDate?: string;
  startLocation?: string;
  endDate?: string;
  endLocation?: string;
}

export default function CurrentShipment({
  recipientName,
  recipientAvatar,
  trackingId,
  status,
  statuses,
  startDate,
  startLocation,
  endDate,
  endLocation,
}: CurrentShipmentProps) {
  // TODO: Uncomment and use this function when you add static images
  // const getStatusImage = (imageName: string) => {
  //   switch(imageName) {
  //     case 'accepted':
  //       return require('../../../assets/tracking/accepted.png');
  //     case 'picked':
  //       return require('../../../assets/tracking/picked.png');
  //     case 'transit':
  //       return require('../../../assets/tracking/transit.png');
  //     case 'outfordelivery':
  //       return require('../../../assets/tracking/outfordelivery.png');
  //     case 'delivered':
  //       return require('../../../assets/tracking/delivered.png');
  //     default:
  //       return null;
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Shipment</Text>

      <View style={styles.recipientInfo}>
        {recipientAvatar ? (
          <Image source={{ uri: recipientAvatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
        <View style={styles.recipientDetails}>
          <Text style={styles.recipientName}>{recipientName}</Text>
          {trackingId && <Text style={styles.trackingId}>{trackingId}</Text>}
        </View>
        <TouchableOpacity style={styles.arrowButton}>
          <Ionicons name="arrow-forward" size={20} color="#FF9800" />
        </TouchableOpacity>
      </View>

      <View style={styles.trackingContainer}>
        {statuses.map((statusItem, index) => (
          <View key={index} style={styles.trackingItem}>
            {/* Icon/Image Container */}
            <View style={styles.iconRow}>
              <View
                style={[
                  styles.statusIconContainer,
                  statusItem.active && styles.statusIconActive,
                ]}
              >
                {/* Placeholder for user's static image */}
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>
                    {statusItem.image.substring(0, 2).toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Dotted line connector */}
              {index < statuses.length - 1 && (
                <View style={styles.dottedLine}>
                  {[...Array(8)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        statusItem.active && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* Checkmark below icon for active items */}
            {statusItem.active && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark" size={16} color="#FF9800" />
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Status Labels */}
      <View style={styles.labelsContainer}>
        {statuses.map((statusItem, index) => (
          <Text
            key={index}
            style={[
              styles.statusLabel,
              statusItem.active && styles.statusLabelActive,
            ]}
          >
            {statusItem.label}
          </Text>
        ))}
      </View>

      {/* Date and Location Info */}
      {(startDate || endDate) && (
        <View style={styles.dateLocationContainer}>
          {startDate && (
            <View style={styles.dateLocationItem}>
              <Text style={styles.dateText}>{startDate}</Text>
              <Text style={styles.locationText}>{startLocation}</Text>
            </View>
          )}
          {endDate && (
            <View style={styles.dateLocationItem}>
              <Text style={styles.dateText}>{endDate}</Text>
              <Text style={styles.locationText}>{endLocation}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  recipientInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.border,
  },
  recipientDetails: {
    flex: 1,
    marginLeft: 12,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  trackingId: {
    fontSize: 12,
    color: "#999999",
    marginTop: 2,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  trackingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  trackingItem: {
    alignItems: "center",
    flex: 1,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  statusIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  statusIconActive: {
    backgroundColor: "#FFF3E0",
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF9800",
  },
  dottedLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    position: "absolute",
    left: "50%",
    width: 40,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#DDDDDD",
  },
  dotActive: {
    backgroundColor: "#FF9800",
  },
  checkmarkContainer: {
    marginTop: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 11,
    color: "#999999",
    textAlign: "center",
    flex: 1,
  },
  statusLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  dateLocationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 16,
  },
  dateLocationItem: {
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#999999",
  },
});
