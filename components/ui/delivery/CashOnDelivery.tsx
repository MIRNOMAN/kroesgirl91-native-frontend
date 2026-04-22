import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import DeliveryButton from "./DeliveryButton";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface ShipmentSummary {
  pickupFrom: {
    label: string;
    address: string;
    details: string;
  };
  deliverTo: {
    label: string;
    name: string;
    address: string;
    details: string;
  };
  parcelDetails: {
    label: string;
    description: string;
    weight: string;
  };
}

interface PricingDetails {
  deliveryFee: number;
  serviceFee: number;
  currency: string;
}

interface CashOnDeliveryProps {
  amount: number;
  shipmentSummary: ShipmentSummary;
  pricingDetails: PricingDetails;
  isSubmitting?: boolean;
  onConfirm: () => void;
  isAgreedToProhibited: boolean;
  setIsAgreedToProhibited: (v: boolean) => void;
}

const CashOnDelivery: React.FC<CashOnDeliveryProps> = ({
  amount,
  shipmentSummary,
  pricingDetails,
  isSubmitting = false,
  onConfirm,
  isAgreedToProhibited,
  setIsAgreedToProhibited,
}) => {
  const total = pricingDetails.deliveryFee + pricingDetails.serviceFee;

  return (
    <View style={styles.container}>
      {/* Cash on Delivery Selection */}
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxSelected}>
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </View>
        <View style={styles.checkboxContent}>
          <Text style={styles.checkboxTitle}>Cash on Delivery</Text>
          <Text style={styles.checkboxSubtitle}>
            Receiver will pay on delivery
          </Text>
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to be collected</Text>
        <View style={styles.amountInputRow}>
          <Text style={styles.amountValue}>
            {pricingDetails.currency}
            {amount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Shipment Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Shipment Summary</Text>

        {/* Pickup From */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryDot}>
            <View style={styles.dotOrange} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>
              {shipmentSummary.pickupFrom.label}
            </Text>
            <Text style={styles.summaryValue}>
              {shipmentSummary.pickupFrom.address}
            </Text>
            <Text style={styles.summaryDetails}>
              {shipmentSummary.pickupFrom.details}
            </Text>
          </View>
        </View>

        {/* Deliver To */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryDot}>
            <View style={styles.dotGreen} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>
              {shipmentSummary.deliverTo.label}
            </Text>
            <Text style={styles.summaryValue}>
              {shipmentSummary.deliverTo.name}
            </Text>
            <Text style={styles.summaryDetails}>
              {shipmentSummary.deliverTo.address}
            </Text>
            <Text style={styles.summaryDetails}>
              {shipmentSummary.deliverTo.details}
            </Text>
          </View>
        </View>

        {/* Parcel Details */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryDot}>
            <Ionicons name="cube-outline" size={16} color="#F5A623" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>
              {shipmentSummary.parcelDetails.label}
            </Text>
            <Text style={styles.summaryValue}>
              {shipmentSummary.parcelDetails.description}
            </Text>
            <Text style={styles.summaryDetails}>
              {shipmentSummary.parcelDetails.weight}
            </Text>
          </View>
        </View>
      </View>

      {/* Pricing Details */}
      <View style={styles.pricingSection}>
        <Text style={styles.pricingTitle}>Pricing Details</Text>

        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>Delivery Fee</Text>
          <Text style={styles.pricingValue}>
            {pricingDetails.currency}
            {pricingDetails.deliveryFee.toFixed(2)}
          </Text>
        </View>

        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>Service Fee</Text>
          <Text style={styles.pricingValue}>
            {pricingDetails.currency}
            {pricingDetails.serviceFee.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.pricingRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {pricingDetails.currency}
            {total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Prohibited items agreement checkbox */}
      {/* Checkbox */}
      <Pressable
        style={styles.checkboxRow}
        onPress={() => setIsAgreedToProhibited(!isAgreedToProhibited)}
      >
        <View
          style={[
            styles.checkbox,
            isAgreedToProhibited && styles.checkboxChecked,
          ]}
        >
          {isAgreedToProhibited && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>
          I confirm that this delivery does not contain harmful goods, drugs, or
          explosives.
        </Text>
      </Pressable>
      <View style={styles.buttonContainer}>
        <DeliveryButton
          title={isSubmitting ? "Submitting..." : "Confirm Booking"}
          onPress={onConfirm}
          variant="secondary"
          disabled={isSubmitting || !isAgreedToProhibited}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F5A623",
    padding: isSmallDevice ? 14 : 16,
    marginBottom: isSmallDevice ? 16 : 20,
  },
  checkboxSelected: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#F5A623",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#1A3A4A",
  },
  checkboxSubtitle: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#666666",
    marginTop: 2,
  },
  amountContainer: {
    marginBottom: isSmallDevice ? 16 : 20,
  },
  amountLabel: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#666666",
    marginBottom: 8,
  },
  amountInputRow: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "flex-end",
  },
  amountValue: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: "700",
    color: "#1A3A4A",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 18,
    width: "100%",
    gap: 10,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: COLORS.onboardingPrimary,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.onboardingPrimary,
    borderColor: COLORS.onboardingPrimary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: -2,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.onboardingPrimary,
    fontWeight: "500",
    marginTop: 2,
  },
  summarySection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: isSmallDevice ? 14 : 16,
    marginBottom: isSmallDevice ? 16 : 20,
  },
  summaryTitle: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#1A3A4A",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  summaryDot: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
  },
  dotOrange: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F5A623",
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#F5A623",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: "500",
    color: "#1A3A4A",
  },
  summaryDetails: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#666666",
    marginTop: 2,
  },
  pricingSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: isSmallDevice ? 14 : 16,
    marginBottom: isSmallDevice ? 16 : 20,
  },
  pricingTitle: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#1A3A4A",
    marginBottom: 12,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  pricingLabel: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#666666",
  },
  pricingValue: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: "500",
    color: "#1A3A4A",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: isSmallDevice ? 14 : 15,
    fontWeight: "600",
    color: "#1A3A4A",
  },
  totalValue: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "700",
    color: "#F5A623",
  },
  buttonContainer: {
    paddingBottom: isSmallDevice ? 20 : 30,
    marginTop: "auto",
  },
});

export default CashOnDelivery;
