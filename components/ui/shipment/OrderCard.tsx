import { useCancelOrderMutation } from "@/redux/api/createDelivery";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { toast } from "sonner-native";
import { COLORS } from "../../../constants/colors";

const { width } = Dimensions.get("window");

// Updated to match your Enum list
const formattedShippingType = (type: string) => {
  switch (type.toUpperCase()) {
    case "COD":
      return "Cash on Delivery";

    case "BANK_TRANSFER":
      return "Bank Transfer";

    default:
      return type;
  }
};

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
  title: string;
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
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();

  const isPending = order.status?.toUpperCase() === "PENDING";

  const [showModal, setShowModal] = useState(false);

  const handleCancelPress = () => {
    if (!isPending) return;
    setShowModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelOrder(order.id).unwrap();
      toast.success("Order cancelled successfully.");
    } catch (err) {
      const errMsg =
        (err as any)?.data?.message ||
        "Failed to cancel order. Please try again.";
      toast.error(errMsg);
      console.log("Cancel failed", err);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <Link href={`/tracking?ordersId=${order.id}`} asChild>
        <Pressable style={styles.orderCard}>
          {/* HEADER */}
          <View style={styles.orderCardContent}>
            <View style={styles.orderIconContainer}>
              <Feather name="package" size={24} color="#F5A623" />
            </View>

            <View style={styles.orderDetails}>
              <Text style={styles.orderId} numberOfLines={1}>
                {order.title}
              </Text>

              <Text style={styles.orderDate}>{order.date}</Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor.bg },
                ]}>
                <Text style={[styles.statusText, { color: statusColor.text }]}>
                  {toDisplayLabel(order.status)}
                </Text>
              </View>
            </View>

            <View style={styles.orderPriceContainer}>
              <Text style={styles.orderPrice}>${order.price?.toFixed(2)}</Text>

              <Text style={styles.shippingType} numberOfLines={1}>
                {formattedShippingType(order.shippingType)}
              </Text>

              {/* Cancel Button */}
              {isPending && (
                <Pressable
                  onPress={handleCancelPress}
                  disabled={isLoading}
                  style={[styles.cancelChip, isLoading && { opacity: 0.5 }]}>
                  <Text style={styles.cancelChipText}>Cancel</Text>
                </Pressable>
              )}
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
              <View style={styles.routeItem}>
                <Text style={styles.routeTitle}>Pickup</Text>
                <Text style={styles.routeTextBold}>
                  {order.pickup_street_address || "__"}
                </Text>
                <Text style={styles.routeText}>{order.origin || "__"}</Text>
              </View>

              <View style={[styles.routeItem, { marginBottom: 0 }]}>
                <Text style={styles.routeTitle}>Delivery</Text>
                <Text style={styles.routeTextBold}>
                  {order.delivery_street_address || "__"}
                </Text>
                <Text style={styles.routeText}>
                  {order.destination || "__"}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Link>

      {/* 🔥 CUSTOM MODAL */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Cancel Order?</Text>
            <Text style={styles.modalDesc}>
              This action cannot be undone. Do you really want to cancel this
              order?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.noBtn]}
                onPress={() => setShowModal(false)}>
                <Text style={styles.noText}>No</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBtn, styles.yesBtn]}
                onPress={handleConfirmCancel}
                disabled={isLoading}>
                <Text style={styles.yesText}>
                  {isLoading ? "Cancelling..." : "Yes, Cancel"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
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

  cancelChip: {
    marginTop: 8,
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EF4444",
    backgroundColor: "#FFF5F5",
  },

  cancelChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#EF4444",
  },

  routeContainer: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  routeIconWrapper: {
    alignItems: "center",
    marginRight: 10,
  },

  routeLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: "#D1D5DB",
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

  routeItem: {
    marginBottom: 18,
  },

  routeTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 2,
  },

  routeText: {
    fontSize: width > 400 ? 13 : 12,
    color: "black",
  },

  routeTextBold: {
    fontSize: width > 400 ? 13 : 12,
    fontWeight: "600",
    color: "black",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  modalDesc: {
    fontSize: 13,
    color: "#666",
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
  },

  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  noBtn: {
    backgroundColor: "#F3F4F6",
  },

  yesBtn: {
    backgroundColor: "#EF4444",
  },

  noText: {
    fontWeight: "600",
    color: "#111",
  },

  yesText: {
    fontWeight: "600",
    color: "#fff",
  },
});
