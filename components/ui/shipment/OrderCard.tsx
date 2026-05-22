import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
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
  pickup_street_address?: string;
  delivery_street_address?: string;

  pickupStatus: string | null;
  deliveryStatus: string | null;
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

  const pickupStreet = order.pickup_street_address;
  const pickupLocation = order.origin;

  const deliveryStreet = order.delivery_street_address;
  const deliveryLocation = order.destination;

  const shouldShowSubStatuses =
    order.pickupStatus !== order.status ||
    order.deliveryStatus !== order.status;

  const pickupStatusColor =
    shouldShowSubStatuses &&
    order.pickupStatus &&
    order.pickupStatus !== order.status
      ? getStatusColor(order.pickupStatus)
      : null;

  const deliveryStatusColor =
    shouldShowSubStatuses &&
    order.deliveryStatus &&
    order.deliveryStatus !== order.status
      ? getStatusColor(order.deliveryStatus)
      : null;

  return (
    // 2. Added 'asChild' prop here
    <Link href={`/tracking?orderId=${order.id}`} asChild>
      {/* 3. Changed root wrapper to Pressable and passed the styles here */}
      <Pressable style={styles.orderCard}>
        {/* HEADER */}
        <View style={styles.orderCardContent}>
          <View style={styles.orderIconContainer}>
            <Feather name="package" size={24} color="#F5A623" />
          </View>

          <View style={styles.orderDetails}>
            <Text style={styles.orderId} numberOfLines={1}>
              {order.id}
            </Text>

            <Text style={styles.orderDate}>{order.date}</Text>

            <View
              style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {toDisplayLabel(order.status)}
              </Text>
            </View>
          </View>

          <View style={styles.orderPriceContainer}>
            <Text style={styles.orderPrice}>${order.price?.toFixed(2)}</Text>

            <Text style={styles.shippingType} numberOfLines={1}>
              {order.shippingType}
            </Text>
          </View>
        </View>

        {/* ROUTE */}
        <View style={styles.routeContainer}>
          <View style={styles.routeIconWrapper}>
            <View style={styles.pickupDot} />
            <View style={styles.routeLine} />
            <View style={styles.deliveryDot} />
          </View>

          <View style={styles.routeContent}>
            {/* PICKUP */}
            <View style={styles.routeItem}>
              <View style={styles.routeRow}>
                <View style={styles.routeTextBlock}>
                  <Text style={styles.routeTitle}>Pickup</Text>

                  <Text style={styles.routeTextBold}>
                    {pickupStreet ? pickupStreet : "__"}
                  </Text>

                  <Text style={styles.routeText}>
                    {pickupLocation ? pickupLocation : "__"}
                  </Text>
                </View>

                {pickupStatusColor && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: pickupStatusColor.bg },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        { color: pickupStatusColor.text },
                      ]}>
                      {toDisplayLabel(order.pickupStatus!)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* DELIVERY */}
            <View style={[styles.routeItem, { marginBottom: 0 }]}>
              <View style={styles.routeRow}>
                <View style={styles.routeTextBlock}>
                  <Text style={styles.routeTitle}>Delivery</Text>

                  <Text style={styles.routeTextBold}>
                    {deliveryStreet ? deliveryStreet : "__"}
                  </Text>

                  <Text style={styles.routeText}>
                    {deliveryLocation ? deliveryLocation : "__"}
                  </Text>
                </View>

                {deliveryStatusColor && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: deliveryStatusColor.bg },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        { color: deliveryStatusColor.text },
                      ]}>
                      {toDisplayLabel(order.deliveryStatus!)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
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
    minWidth: 0,
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
    justifyContent: "flex-start",
    maxWidth: "35%",
    marginLeft: 8,
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
    textAlign: "right",
  },

  routeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  routeIconWrapper: {
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },

  routeLine: {
    width: 1.5,
    flex: 1,
    minHeight: 18,
    height: 45,
    backgroundColor: "#D1D5DB",
    marginVertical: 2,
  },

  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#22C55E",
  },

  deliveryDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#EF4444",
  },

  routeContent: {
    flex: 1,
  },

  routeTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  routeText: {
    fontSize: width > 400 ? 13 : 12,
    color: "black",
    lineHeight: 18,
  },

  routeTextBold: {
    fontSize: width > 400 ? 13 : 12,
    color: "black",
    fontWeight: "600",
    lineHeight: 18,
  },

  routeItem: {
    marginBottom: 26,
  },

  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  routeTextBlock: {
    flex: 1,
    paddingRight: 10,
  },
});
