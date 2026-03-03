import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface DropoffLocation {
  label: string;
  address: string;
  distance: string;
}

interface Driver {
  name: string;
  avatar: string;
}

interface Vehicle {
  number: string;
  type: string;
}

interface DriverArrivedCardProps {
  title: string;
  subtitle: string;
  dropoffLocation: DropoffLocation;
  driver: Driver;
  vehicle: Vehicle;
  onMessageDriver?: () => void;
  onClose?: () => void;
  messageButtonText?: string;
  closeButtonText?: string;
}

export default function DriverArrivedCard({
  title,
  subtitle,
  dropoffLocation,
  driver,
  vehicle,
  onMessageDriver,
  onClose,
  messageButtonText = "Message Driver",
  closeButtonText = "Close",
}: DriverArrivedCardProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Dropoff Location Info */}
      <View style={styles.locationCard}>
        <View style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={18} color="#003C52" />
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.locationLabel}>{dropoffLocation.label}</Text>
            <Text style={styles.locationAddress}>
              {dropoffLocation.address}
            </Text>
          </View>
          <View style={styles.distanceContainer}>
            <Text style={styles.distance}>{dropoffLocation.distance}</Text>
            <Text style={styles.distanceUnit}>Km</Text>
          </View>
        </View>
      </View>

      {/* Vehicle & Driver Info */}
      <View style={styles.vehicleCard}>
        <View style={styles.vehicleIconContainer}>
          <Image
            source={require("../../../assets/traking_image/traking_1.png")}
            style={styles.vehicleImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleNumber}>{vehicle.number}</Text>
          <Text style={styles.vehicleType}>{vehicle.type}</Text>
        </View>
        <View style={styles.driverContainer}>
          <Image source={{ uri: driver.avatar }} style={styles.driverAvatar} />
          <Text style={styles.driverName}>{driver.name}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={onMessageDriver}
          activeOpacity={0.8}
        >
          <Text style={styles.messageButtonText}>{messageButtonText}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.closeButtonText}>{closeButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: "700",
    color: "#003C52",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#A0A0A0",
  },
  locationCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: isSmallDevice ? 11 : 12,
    color: "#A0A0A0",
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: "500",
    color: "#003C52",
  },
  distanceContainer: {
    alignItems: "flex-end",
  },
  distance: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: "700",
    color: "#003C52",
  },
  distanceUnit: {
    fontSize: isSmallDevice ? 10 : 11,
    color: "#A0A0A0",
  },
  vehicleCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  vehicleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  vehicleImage: {
    width: 44,
    height: 44,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleNumber: {
    fontSize: isSmallDevice ? 14 : 15,
    fontWeight: "600",
    color: "#003C52",
    marginBottom: 2,
  },
  vehicleType: {
    fontSize: isSmallDevice ? 11 : 12,
    color: "#A0A0A0",
  },
  driverContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  driverAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  driverName: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: "500",
    color: "#003C52",
    maxWidth: isSmallDevice ? 70 : 90,
  },
  buttonContainer: {
    gap: 10,
  },
  messageButton: {
    backgroundColor: "#003C52",
    borderRadius: 12,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    alignItems: "center",
  },
  messageButtonText: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeButton: {
    backgroundColor: "#003C52",
    borderRadius: 12,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
