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
  fareOptions?: {
    id: string;
    label: string;
    price: number;
  }[];
  currency: string;
  priceLabel: string;
  icon: string;
}

interface ChooseRideProps {
  rideOptions: RideOption[];
  selectedRide: string | null;
  selectedFareOptionId: string | null;
  onSelectRide: (rideId: string) => void;
  onSelectFareOption: (rideId: string, fareOptionId: string) => void;
  onNext: () => void;
}

const ChooseRide: React.FC<ChooseRideProps> = ({
  rideOptions,
  selectedRide,
  selectedFareOptionId,
  onSelectRide,
  onSelectFareOption,
  onNext,
}) => {
  const [openFareDropdownForRide, setOpenFareDropdownForRide] = React.useState<
    string | null
  >(null);

  const selectedRideOption = rideOptions.find(
    (item) => item.id === selectedRide,
  );
  const requiresFareOption = Boolean(
    selectedRideOption?.fareOptions &&
    selectedRideOption.fareOptions.length > 0,
  );
  const canProceed =
    Boolean(selectedRide) &&
    (!requiresFareOption || Boolean(selectedFareOptionId));

  const formatPrice = (price: number) => {
    if (!Number.isFinite(price)) {
      return "0";
    }

    return `${price}`;
  };

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
      <View style={styles.headerRow}>
        <Text style={styles.title}>Choose a ride</Text>
        <View style={styles.closeIconButton}>
          <Ionicons name="close" size={14} color="#606060" />
        </View>
      </View>

      <View style={styles.rideOptions}>
        {rideOptions.map((option) => {
          const isSelected = selectedRide === option.id;
          const hasFareOptions = Boolean(
            option.fareOptions && option.fareOptions.length > 0,
          );
          const isDropdownOpen = openFareDropdownForRide === option.id;
          const selectedOptionFare = option.fareOptions?.find(
            (item) => item.id === selectedFareOptionId,
          );

          return (
            <View
              key={option.id}
              style={[styles.rideCard, isSelected && styles.rideCardSelected]}
            >
              <TouchableOpacity
                style={styles.rideCardPressable}
                onPress={() => {
                  onSelectRide(option.id);
                  setOpenFareDropdownForRide(null);
                }}
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
                    {formatPrice(selectedOptionFare?.price ?? option.price)}
                  </Text>
                  <Text style={styles.priceLabel}>SRD$</Text>
                </View>
              </TouchableOpacity>

              {isSelected && hasFareOptions && (
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() =>
                      setOpenFareDropdownForRide((prev) =>
                        prev === option.id ? null : option.id,
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownTriggerText}>
                      {selectedOptionFare
                        ? `${selectedOptionFare.label} = ${formatPrice(selectedOptionFare.price)} SUR$`
                        : "Select distance range"}
                    </Text>
                    <Ionicons
                      name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#4E5A61"
                    />
                  </TouchableOpacity>

                  {isDropdownOpen && (
                    <View style={styles.dropdownMenu}>
                      {option.fareOptions?.map((fareOption) => {
                        const isFareOptionSelected =
                          selectedFareOptionId === fareOption.id;

                        return (
                          <TouchableOpacity
                            key={fareOption.id}
                            style={styles.dropdownItem}
                            onPress={() => {
                              onSelectFareOption(option.id, fareOption.id);
                              setOpenFareDropdownForRide(null);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                isFareOptionSelected &&
                                  styles.dropdownItemTextSelected,
                              ]}
                            >
                              {`${fareOption.label} = ${formatPrice(fareOption.price)} Sur$`}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <DeliveryButton title="Next" onPress={onNext} disabled={!canProceed} />
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
    fontSize: isSmallDevice ? 17 : 19,
    fontWeight: "600",
    color: "#1B1B1B",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: isSmallDevice ? 16 : 20,
  },
  closeIconButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  rideOptions: {
    flex: 1,
  },
  rideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    padding: isSmallDevice ? 10 : 12,
    marginBottom: 12,
  },
  rideCardPressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  rideCardSelected: {
    borderColor: "#F5A623",
    backgroundColor: "#FFF8EA",
  },
  rideInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rideIconContainer: {
    width: isSmallDevice ? 70 : 74,
    height: isSmallDevice ? 46 : 50,
    borderRadius: 8,
    backgroundColor: "#F6E8CA",
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
    color: "#232323",
  },
  rideSubtitle: {
    fontSize: isSmallDevice ? 11 : 12,
    color: "#787878",
    marginTop: 1,
  },
  rideDescription: {
    fontSize: isSmallDevice ? 10 : 11,
    color: "#999999",
    marginTop: 1,
  },
  priceContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 48,
  },
  priceText: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: "700",
    color: "#1B1B1B",
    lineHeight: isSmallDevice ? 18 : 20,
  },
  priceLabel: {
    fontSize: 11,
    color: "#1B1B1B",
    fontWeight: "600",
  },
  buttonContainer: {
    paddingBottom: isSmallDevice ? 16 : 24,
  },
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 10,
    backgroundColor: "#FFF3DB",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownTriggerText: {
    flex: 1,
    marginRight: 8,
    fontSize: 13,
    color: "#A16A00",
    fontWeight: "600",
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9E9E9",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#262626",
  },
  dropdownItemTextSelected: {
    color: "#A16A00",
    fontWeight: "700",
  },
});

export default ChooseRide;
