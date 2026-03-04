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

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface RideOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  currency: string;
  priceLabel: string;
  icon: string;
}

interface ChooseRideProps {
  rideOptions: RideOption[];
  selectedRide: string | null;
  onSelectRide: (rideId: string) => void;
  onNext: () => void;
}

const ChooseRide: React.FC<ChooseRideProps> = ({
  rideOptions,
  selectedRide,
  onSelectRide,
  onNext,
}) => {
  const getIconName = (icon: string): keyof typeof Ionicons.glyphMap => {
    switch (icon) {
      case "bicycle":
        return "bicycle";
      case "car":
        return "car";
      case "time":
        return "time";
      default:
        return "bicycle";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a ride</Text>

      <View style={styles.dropdownContainer}>
        <Ionicons name="bicycle" size={20} color="#F5A623" />
        <Text style={styles.dropdownText}>Choose a ride</Text>
        <Ionicons name="chevron-down" size={20} color="#999999" />
      </View>

      <View style={styles.rideOptions}>
        {rideOptions.map((option) => {
          const isSelected = selectedRide === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.rideCard, isSelected && styles.rideCardSelected]}
              onPress={() => onSelectRide(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.rideInfo}>
                <View style={styles.rideIconContainer}>
                  <Ionicons
                    name={getIconName(option.icon)}
                    size={24}
                    color={isSelected ? "#F5A623" : "#1A3A4A"}
                  />
                </View>
                <View style={styles.rideDetails}>
                  <Text style={styles.rideTitle}>{option.title}</Text>
                  <Text style={styles.rideSubtitle}>{option.subtitle}</Text>
                  {option.description && (
                    <Text style={styles.rideDescription}>
                      {option.description}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {option.currency}
                  {option.price}
                </Text>
                <Text style={styles.priceLabel}>{option.priceLabel}</Text>
              </View>
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color="#F5A623" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
    fontSize: isSmallDevice ? 20 : 22,
    fontWeight: "700",
    color: "#1A3A4A",
    marginBottom: isSmallDevice ? 16 : 20,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: isSmallDevice ? 16 : 20,
  },
  dropdownText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#666666",
  },
  rideOptions: {
    flex: 1,
  },
  rideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: isSmallDevice ? 14 : 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rideCardSelected: {
    borderColor: "#F5A623",
    borderWidth: 2,
    backgroundColor: "#FFFBF5",
  },
  rideInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rideIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },
  rideDetails: {
    flex: 1,
    marginLeft: 12,
  },
  rideTitle: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#1A3A4A",
  },
  rideSubtitle: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#666666",
    marginTop: 2,
  },
  rideDescription: {
    fontSize: 11,
    color: "#999999",
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  priceText: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "700",
    color: "#1A3A4A",
  },
  priceLabel: {
    fontSize: 12,
    color: "#F5A623",
    fontWeight: "500",
  },
  selectedIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonContainer: {
    paddingBottom: isSmallDevice ? 20 : 30,
  },
});

export default ChooseRide;
