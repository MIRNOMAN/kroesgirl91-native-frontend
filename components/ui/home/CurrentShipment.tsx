

import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../../constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(Math.max(SCREEN_WIDTH * 0.055, 18), 24);

interface ShipmentStatus {
  image: string;
  label: string;
  active: boolean;
}

interface CurrentShipmentProps {
  recipientName: string;
 
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
 
  trackingId,
  status,
  statuses,
  startDate,
  startLocation,
  endDate,
  endLocation,
}: CurrentShipmentProps) {
  // const getStatusImage = (imageName: string) => {
  //   switch (imageName) {
  //     case "accepted":
  //       return require("../../../assets/traking_image/traking_1.png");
  //     case "picked":
  //       return require("../../../assets/traking_image/traking_2.png");
  //     case "transit":
  //       return require("../../../assets/traking_image/traking_3.png");
  //     case "outfordelivery":
  //       return require("../../../assets/traking_image/traking_4.png");
  //     case "delivered":
  //       return require("../../../assets/traking_image/traking_5.png");
  //     default:
  //       return null;
  //   }
  // };

  function formatDateTime(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

  return (
    <View style={styles.container}>
      <View style={styles.recipientInfo}>
    

        <View style={styles.recipientDetails}>
          <Text style={styles.recipientName}>{recipientName}</Text>
          {trackingId && <Text style={styles.trackingId}>{trackingId}</Text>}
        </View>

        <TouchableOpacity style={styles.arrowButton}>
          <Feather name="arrow-up-right" size={24} color="#FF9800" />
        </TouchableOpacity>
      </View>

      {/* Status Images Row */}
      {/* <View style={styles.imagesContainer}>
        {statuses.map((statusItem, index) => (
          <View key={index}>
            {getStatusImage(statusItem.image) ? (
              <Image
                source={getStatusImage(statusItem.image)}
                style={[
                  styles.statusImage,
                  !statusItem.active && styles.statusImageInactive,
                ]}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>
                  {statusItem.image.substring(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View> */}

      {/* Status Circles with Checkmarks */}
      <View style={styles.trackingContainer}>
        {statuses.map((statusItem, index) => (
          <React.Fragment key={index}>
           
            <View
              style={[
                styles.outerCircle,
                statusItem.active
                  ? styles.outerCircleActive
                  : styles.outerCircleInactive,
              ]}
            >
             
              <View
                style={[
                  styles.statusCircle,
                  statusItem.active
                    ? styles.statusCircleActive
                    : styles.statusCircleInactive,
                ]}
              >
                {statusItem.active && (
                  <Ionicons
                    name="checkmark"
                    size={CIRCLE_SIZE * 0.7}
                    style={styles.checkmark}
                  />
                )}
              </View>
            </View>

            {index < statuses.length - 1 && (
              <View style={styles.connectorLine}>
                {[...Array(4)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dottedSquare,
                      statuses[index + 1].active
                        ? styles.dottedSquareActive
                        : styles.dottedSquareInactive,
                    ]}
                  />
                ))}
              </View>
            )}
          </React.Fragment>
        ))}
      </View>

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

      {(startDate || endDate) && (
        <View style={styles.dateLocationContainer}>
          {startDate && (
            <View style={{ flex: 1 }}>
              <Text style={styles.dateText}>From</Text>
              <Text style={styles.dateText}>{formatDateTime(startDate)}</Text>
              <Text style={styles.locationText}>{startLocation || '-'}</Text>
            </View>
          )}
          {endDate && (
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.dateText}>To</Text>
              <Text style={styles.dateText}>{formatDateTime(endDate)}</Text>
              <Text style={styles.locationText}>{endLocation || '-'}</Text>
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
    padding: 12,
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
    width: 45,
    height: 45,
    borderRadius: 12,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.border,
  },
  recipientDetails: {
    flex: 1,
    marginLeft: 12,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  trackingId: {
    fontSize: 12,
    color: "#999999",
    marginTop: 2,
  },
  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 6,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  trackingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: 0,

    paddingTop: 10,
  },
  statusCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  statusCircleActive: {
    backgroundColor: "#F5A623",
    borderColor: "#F5A623",
  },
  outerCircle: {
    width: CIRCLE_SIZE + 8,
    height: CIRCLE_SIZE + 8,
    borderRadius: (CIRCLE_SIZE + 12) / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },

  outerCircleActive: {
    borderColor: "#F5A623",
  },

  outerCircleInactive: {
    borderColor: "#FFE0B2",
  },
  statusCircleInactive: {
    backgroundColor: "transparent",
    borderColor: "#F5A623",
  },
  connectorLine: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
    gap: 3,
  },
  dottedSquare: {
    width: 5,
    height: 5,
    borderRadius: 1.5,
  },
  dottedSquareActive: {
    backgroundColor: "#F5A623",
  },
  dottedSquareInactive: {
    backgroundColor: "#E0E0E0",
  },

  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
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

    paddingTop: 16,
  },

  dateText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 18,
  },

  statusImage: {
    width: 30,
    height: 30,
  },
  statusImageInactive: {
    opacity: 0.4,
  },
  imagePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#999999",
  },
  checkmark: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A1A",
  },
});
