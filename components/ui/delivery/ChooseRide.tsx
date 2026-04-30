import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
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
  const [openFareDropdownForRide, setOpenFareDropdownForRide] = useState<
    string | null
  >(null);

  const selectedRideOption = useMemo(
    () => rideOptions.find((item) => item.id === selectedRide),
    [rideOptions, selectedRide],
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
            (fareOption) => fareOption.id === selectedFareOptionId,
          );
          const displayedPrice = selectedOptionFare?.price ?? option.price;

          return (
            <View
              key={option.id}
              style={[
                styles.rideCard,
                isSelected && styles.rideCardSelected,
                isDropdownOpen && styles.rideCardWithDropdown,
              ]}>
              <TouchableOpacity
                style={styles.rideCardPressable}
                onPress={() => {
                  onSelectRide(option.id);

                  if (!hasFareOptions) {
                    setOpenFareDropdownForRide(null);
                    return;
                  }

                  setOpenFareDropdownForRide((prev) =>
                    prev === option.id ? null : option.id,
                  );
                }}
                activeOpacity={0.7}>
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
                    {isSelected && selectedOptionFare ? (
                      <Text style={styles.rideFareSummary}>
                        {selectedOptionFare.label}
                      </Text>
                    ) : option.description ? (
                      <Text style={styles.rideDescription}>
                        {option.description}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.rideMeta}>
                  {isSelected ? (
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceText}>
                        {formatPrice(displayedPrice)}
                      </Text>
                      <Text style={styles.priceLabel}>SUR$</Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>

              {isSelected && hasFareOptions && isDropdownOpen && (
                <View style={styles.dropdownContainer}>
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
                          activeOpacity={0.7}>
                          <Text
                            style={[
                              styles.dropdownItemText,
                              isFareOptionSelected &&
                                styles.dropdownItemTextSelected,
                            ]}>
                            {`${fareOption.label} = ${formatPrice(
                              fareOption.price,
                            )} Sur$`}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
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
    overflow: "visible",
  },
  rideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    padding: isSmallDevice ? 12 : 14,
    marginBottom: 12,
    position: "relative",
  },
  rideCardPressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rideCardSelected: {
    borderColor: "#F5A623",
    backgroundColor: "#FFF8EA",
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
  },
  rideCardWithDropdown: {
    zIndex: 2,
  },
  rideInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rideIconContainer: {
    width: isSmallDevice ? 72 : 76,
    height: isSmallDevice ? 50 : 54,
    borderRadius: 12,
    backgroundColor: "#FAE7C3",
    alignItems: "center",
    justifyContent: "center",
  },
  rideDetails: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
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
  rideFareSummary: {
    fontSize: isSmallDevice ? 10 : 11,
    color: "#8B8B8B",
    marginTop: 2,
    textTransform: "uppercase",
  },
  rideDescription: {
    fontSize: isSmallDevice ? 10 : 11,
    color: "#999999",
    marginTop: 1,
  },
  rideMeta: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 56,
  },
  priceContainer: {
    alignItems: "flex-end",
    marginBottom: 2,
  },
  priceText: {
    fontSize: isSmallDevice ? 17 : 18,
    fontWeight: "700",
    color: "#141414",
    lineHeight: isSmallDevice ? 18 : 20,
  },
  priceLabel: {
    fontSize: 11,
    color: "#141414",
    fontWeight: "600",
    marginTop: -1,
  },
  buttonContainer: {
    paddingBottom: isSmallDevice ? 16 : 24,
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownMenu: {
    position: "absolute",
    top: 8,
    left: isSmallDevice ? 72 : 84,
    right: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF0F2",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#414141",
    fontWeight: "500",
    textAlign: "center",
  },
  dropdownItemTextSelected: {
    color: "#F5A623",
    fontWeight: "700",
  },
});

export default ChooseRide;
