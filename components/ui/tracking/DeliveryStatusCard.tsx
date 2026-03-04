import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface ProgressStep {
  id: number;
  label: string;
  icon: string;
  completed: boolean;
}

interface Driver {
  id: string;
  name: string;
  driverId: string;
  avatar: string;
  phone: string;
  rating: number;
}

interface OrderDetails {
  orderDate: string;
  deliveryDate: string;
  pickupLocation: string;
  deliveryLocation: string;
  customer: string;
  orderCost: string;
  quantity: string;
  weight: string;
}

interface DeliveryStatusCardProps {
  driver: Driver;
  progress: ProgressStep[];
  orderDetails: OrderDetails;
  paymentMethod: string;
  onChoosePremier?: () => void;
  onCallDriver?: () => void;
  buttonText?: string;
}

const getStatusImage = (icon: string) => {
  switch (icon) {
    case "accepted":
      return require("../../../assets/traking_image/traking_1.png");
    case "picked":
      return require("../../../assets/traking_image/traking_2.png");
    case "transit":
      return require("../../../assets/traking_image/traking_3.png");
    case "outForDelivery":
      return require("../../../assets/traking_image/traking_4.png");
    case "delivered":
      return require("../../../assets/traking_image/traking_5.png");
    default:
      return require("../../../assets/traking_image/traking_1.png");
  }
};

export default function DeliveryStatusCard({
  driver,
  progress,
  orderDetails,
  paymentMethod,
  onChoosePremier,
  onCallDriver,
  buttonText = "Choose Premier",
}: DeliveryStatusCardProps) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Delivery Status</Text>

        <View style={styles.driverSection}>
          <View style={styles.driverInfo}>
            <Image
              source={{ uri: driver.avatar }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverId}>{driver.driverId}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            onPress={onCallDriver}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.imagesRow}>
            {progress.map((step) => (
              <View key={step.id} style={styles.imageWrapper}>
                <Image
                  source={getStatusImage(step.icon)}
                  style={[
                    styles.statusImage,
                    !step.completed && styles.statusImageInactive,
                  ]}
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>

          <View style={styles.dotsRow}>
            {progress.map((step, index) => (
              <View key={step.id} style={styles.dotWrapper}>
                <View
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: step.completed ? "#FFB800" : "#E0E0E0",
                    },
                  ]}
                >
                  {step.completed && (
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  )}
                </View>
                {index < progress.length - 1 && (
                  <View
                    style={[
                      styles.progressLine,
                      {
                        backgroundColor: step.completed ? "#FFB800" : "#E0E0E0",
                      },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          <View style={styles.labelsRow}>
            {progress.map((step) => (
              <Text
                key={step.id}
                style={[
                  styles.progressLabel,
                  { color: step.completed ? "#003C52" : "#A0A0A0" },
                ]}
                numberOfLines={2}
              >
                {step.label}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.orderSection}>
          <View style={styles.orderRow}>
            <View style={styles.orderColumn}>
              <Text style={styles.orderLabel}>{orderDetails.orderDate}</Text>
              <Text style={styles.orderValue}>
                {orderDetails.pickupLocation}
              </Text>
            </View>
            <View style={styles.orderColumn}>
              <Text style={styles.orderLabel}>{orderDetails.deliveryDate}</Text>
              <Text style={styles.orderValue}>
                {orderDetails.deliveryLocation}
              </Text>
            </View>
          </View>

          <View style={styles.orderRow}>
            <View style={styles.orderColumn}>
              <Text style={styles.orderLabel}>Customer</Text>
              <Text style={styles.orderValue}>{orderDetails.customer}</Text>
            </View>
            <View style={styles.orderColumn}>
              <Text style={styles.orderLabel}>Order Cost</Text>
              <Text style={styles.orderValue}>{orderDetails.orderCost}</Text>
            </View>
          </View>

          <View style={styles.orderRow}>
            <View style={styles.orderColumn}>
              <Text style={styles.orderLabel}>Quantity</Text>
              <Text style={styles.orderValue}>{orderDetails.quantity}</Text>
            </View>
            <View style={styles.orderColumn}>
              <Text style={styles.orderLabel}>Weight</Text>
              <Text style={styles.orderValue}>{orderDetails.weight}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.paymentSection} activeOpacity={0.7}>
          <View style={styles.paymentInfo}>
            <Ionicons name="cash-outline" size={20} color="#003C52" />
            <Text style={styles.paymentText}>{paymentMethod}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.premierButton}
          onPress={onChoosePremier}
          activeOpacity={0.8}
        >
          <Text style={styles.premierButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  headerTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "700",
    color: "#003C52",
    marginBottom: 16,
  },
  driverSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  driverAvatar: {
    width: isSmallDevice ? 44 : 50,
    height: isSmallDevice ? 44 : 50,
    borderRadius: isSmallDevice ? 22 : 25,
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "600",
    color: "#003C52",
  },
  driverId: {
    fontSize: isSmallDevice ? 11 : 12,
    color: "#A0A0A0",
    marginTop: 2,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFB800",
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    marginBottom: 20,
  },
  imagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  imageWrapper: {
    flex: 1,
    alignItems: "center",
  },
  statusImage: {
    width: isSmallDevice ? 32 : 40,
    height: isSmallDevice ? 32 : 40,
  },
  statusImageInactive: {
    opacity: 0.4,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: isSmallDevice ? 8 : 12,
    marginBottom: 8,
  },
  dotWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  progressDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginLeft: -2,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    flex: 1,
    fontSize: isSmallDevice ? 9 : 10,
    textAlign: "center",
  },
  orderSection: {
    marginBottom: 16,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderColumn: {
    flex: 1,
  },
  orderLabel: {
    fontSize: isSmallDevice ? 11 : 12,
    color: "#A0A0A0",
    marginBottom: 2,
  },
  orderValue: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: "500",
    color: "#003C52",
  },
  paymentSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    marginBottom: 16,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    fontSize: isSmallDevice ? 14 : 15,
    fontWeight: "500",
    color: "#003C52",
    marginLeft: 10,
  },
  premierButton: {
    backgroundColor: "#003C52",
    borderRadius: 12,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 0 : 50,
    
  },
  premierButtonText: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
