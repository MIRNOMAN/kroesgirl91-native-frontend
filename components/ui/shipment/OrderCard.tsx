import { Feather } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../constants/colors";

const { width } = Dimensions.get("window");

const toDisplayLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export interface Order {
  id: string;
  date: string;
  status: string;
  price: number;
  shippingType: string;
  origin: string;
  destination: string;
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "SUCCESSFUL":
      return { bg: "#E8F5E9", text: "#2E7D32" };
    case "PENDING":
      return { bg: "#FFF3E0", text: "#E65100" };
    case "STARTED":
      return { bg: "#E3F2FD", text: "#1565C0" };
    case "ARRIVED":
      return { bg: "#E0F2FE", text: "#0369A1" };
    case "CANCELLED":
      return { bg: "#FFEBEE", text: "#C62828" };
    default:
      return { bg: "#E3F2FD", text: "#1565C0" };
  }
};

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const statusColor = getStatusColor(order.status);

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderCardContent}>
        <View style={styles.orderIconContainer}>
          <Feather name="package" size={24} color="#F5A623" />
        </View>
        <View style={styles.orderDetails}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}
          >
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {toDisplayLabel(order.status)}
            </Text>
          </View>
        </View>
        <View style={styles.orderPriceContainer}>
          <Text style={styles.orderPrice}>${order.price.toFixed(2)}</Text>
          <Text style={styles.shippingType}>{order.shippingType}</Text>
        </View>
      </View>
      <View style={styles.routeContainer}>
        <Feather name="map-pin" size={14} color="#999" />
        <Text style={styles.routeText}>
          {order.origin} → {order.destination}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  orderCardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  orderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFF8E7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontSize: width > 400 ? 16 : 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: width > 400 ? 13 : 12,
    color: "#999",
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  orderPriceContainer: {
    alignItems: "flex-end",
  },
  orderPrice: {
    fontSize: width > 400 ? 17 : 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  shippingType: {
    fontSize: width > 400 ? 13 : 12,
    color: "#999",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 6,
  },
  routeText: {
    fontSize: width > 400 ? 13 : 12,
    color: "#666",
  },
});
