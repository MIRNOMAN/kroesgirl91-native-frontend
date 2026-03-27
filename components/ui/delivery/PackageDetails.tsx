import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeliveryButton from "./DeliveryButton";
import DeliveryInput from "./DeliveryInput";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface PackageData {
  description: string;
  instructions: string;
  quantity: number;
  weight: number;
  paymentMethod: "cash" | "bank" | null;
}

interface PackageDetailsProps {
  title: string;
  subtitle: string;
  data: PackageData;
  onDataChange: (data: PackageData) => void;
  onNext: () => void;
}

const PackageDetails: React.FC<PackageDetailsProps> = ({
  title,
  subtitle,
  data,
  onDataChange,
  onNext,
}) => {
  const incrementWeight = () => {
    onDataChange({ ...data, weight: data.weight + 1 });
  };

  const decrementWeight = () => {
    if (data.weight > 0) {
      onDataChange({ ...data, weight: data.weight - 1 });
    }
  };

  const incrementQuantity = () => {
    onDataChange({ ...data, quantity: data.quantity + 1 });
  };

  const decrementQuantity = () => {
    if (data.quantity > 1) {
      onDataChange({ ...data, quantity: data.quantity - 1 });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.form}>
        <DeliveryInput
          label="Package Description"
          placeholder="What are you sending?"
          value={data.description}
          onChangeText={(text) => onDataChange({ ...data, description: text })}
        />

        <DeliveryInput
          label="Special Instructions (Optional)"
          placeholder="Any special handling instructions?"
          value={data.instructions}
          onChangeText={(text) => onDataChange({ ...data, instructions: text })}
          multiline
        />

        {/* Weight Input */}
        <View style={styles.weightContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <View style={styles.weightInputRow}>
            <Text style={styles.weightPlaceholder}>Set parcel Width</Text>
            <View style={styles.weightControls}>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={decrementWeight}
              >
                <Ionicons name="remove" size={20} color="#1A3A4A" />
              </TouchableOpacity>
              <Text style={styles.weightValue}>{data.weight}</Text>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={incrementWeight}
              >
                <Ionicons name="add" size={20} color="#1A3A4A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quantity Input */}
        <View style={styles.weightContainer}>
          <Text style={styles.label}>Quantity</Text>
          <View style={styles.weightInputRow}>
            <Text style={styles.weightPlaceholder}>Set parcel quantity</Text>
            <View style={styles.weightControls}>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={decrementQuantity}
              >
                <Ionicons name="remove" size={20} color="#1A3A4A" />
              </TouchableOpacity>
              <Text style={styles.weightValue}>{data.quantity}</Text>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={incrementQuantity}
              >
                <Ionicons name="add" size={20} color="#1A3A4A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentContainer}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentCard,
                data.paymentMethod === "cash" && styles.paymentCardSelected,
              ]}
              onPress={() => onDataChange({ ...data, paymentMethod: "cash" })}
            >
              <Ionicons
                name="cash-outline"
                size={24}
                color={data.paymentMethod === "cash" ? "#F5A623" : "#666666"}
              />
              <Text
                style={[
                  styles.paymentText,
                  data.paymentMethod === "cash" && styles.paymentTextSelected,
                ]}
              >
                Cash on Delivery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentCard,
                data.paymentMethod === "bank" && styles.paymentCardSelected,
              ]}
              onPress={() => onDataChange({ ...data, paymentMethod: "bank" })}
            >
              <Ionicons
                name="card-outline"
                size={24}
                color={data.paymentMethod === "bank" ? "#F5A623" : "#666666"}
              />
              <Text
                style={[
                  styles.paymentText,
                  data.paymentMethod === "bank" && styles.paymentTextSelected,
                ]}
              >
                Bank transfer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <DeliveryButton title="Next" onPress={onNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  title: {
    fontSize: isSmallDevice ? 21 : 22,
    fontWeight: "700",
    color: "#1A3A4A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#666666",
    marginBottom: isSmallDevice ? 20 : 24,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  weightContainer: {
    marginBottom: isSmallDevice ? 16 : 20,
  },
  weightInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  weightPlaceholder: {
    fontSize: 14,
    color: "#AAAAAA",
  },
  weightControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  weightValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A3A4A",
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: "center",
  },
  paymentContainer: {
    marginBottom: isSmallDevice ? 16 : 20,
  },
  paymentOptions: {
    flexDirection: "row",
    gap: 12,
  },
  paymentCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingVertical: isSmallDevice ? 16 : 20,
    paddingHorizontal: 12,
  },
  paymentCardSelected: {
    borderColor: "#F5A623",
    borderWidth: 2,
    backgroundColor: "#FFFBF5",
  },
  paymentText: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#666666",
    marginTop: 8,
    textAlign: "center",
  },
  paymentTextSelected: {
    color: "#1A3A4A",
    fontWeight: "500",
  },
  buttonContainer: {
    paddingBottom: isSmallDevice ? 20 : 30,
  },
});

export default PackageDetails;
