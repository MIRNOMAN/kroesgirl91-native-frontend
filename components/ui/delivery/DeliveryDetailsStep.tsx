import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DeliveryButton from "./DeliveryButton";
import DeliveryInput from "./DeliveryInput";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;

const GOOGLE_PLACES_API_KEY = "AIzaSyAWTfPRGzLQr32QPUaz8YrLcrK_rsZDKR0";

interface DeliveryData {
  name: string;
  phoneNumber: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
}

interface DeliveryDetailsProps {
  title: string;
  subtitle: string;
  data: DeliveryData;
  onDataChange: (data: DeliveryData) => void;
  onNext: () => void;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  title,
  subtitle,
  data,
  onDataChange,
  onNext,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query,
        )}&key=${GOOGLE_PLACES_API_KEY}&types=address`,
      );
      const result = await response.json();
      if (result.predictions) {
        setPredictions(result.predictions);
      }
    } catch (error) {
      console.error("Error searching places:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectPlace = async (placeId: string, description: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_PLACES_API_KEY}`,
      );
      const result = await response.json();

      const location = result.result?.geometry?.location;
      onDataChange({
        ...data,
        fullAddress: description,
        latitude: location?.lat,
        longitude: location?.lng,
      });
    } catch {
      onDataChange({ ...data, fullAddress: description });
    }
    setShowLocationModal(false);
    setSearchQuery("");
    setPredictions([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.form}>
        <DeliveryInput
          label="Name"
          placeholder="Enter receiver name"
          value={data.name}
          onChangeText={(text) => onDataChange({ ...data, name: text })}
          icon="person-outline"
        />

        <DeliveryInput
          label="Phone Number"
          placeholder="+597 xx xxxx"
          value={data.phoneNumber}
          onChangeText={(text) => onDataChange({ ...data, phoneNumber: text })}
          keyboardType="phone-pad"
          icon="call-outline"
        />

        <DeliveryInput
          label="Full Address"
          placeholder="Who should we contact?"
          value={data.fullAddress}
          onChangeText={(text) => onDataChange({ ...data, fullAddress: text })}
          icon="location-outline"
          isLocationInput
          onLocationPress={() => setShowLocationModal(true)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <DeliveryButton title="Next" onPress={onNext} />
      </View>

      {/* Location Search Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Location</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowLocationModal(false)}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for address..."
                placeholderTextColor="#AAAAAA"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchPlaces(text);
                }}
                autoFocus
              />
              {loading && <ActivityIndicator size="small" color="#F5A623" />}
            </View>

            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.predictionItem}
                  onPress={() => selectPlace(item.place_id, item.description)}
                >
                  <Ionicons name="location-outline" size={20} color="#F5A623" />
                  <View style={styles.predictionText}>
                    <Text style={styles.predictionMain}>
                      {item.structured_formatting.main_text}
                    </Text>
                    <Text style={styles.predictionSecondary}>
                      {item.structured_formatting.secondary_text}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                searchQuery.length >= 3 && !loading ? (
                  <Text style={styles.noResults}>No results found</Text>
                ) : null
              }
              style={styles.predictionsList}
            />
          </View>
        </View>
      </Modal>
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
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#666666",
    marginBottom: isSmallDevice ? 20 : 24,
  },
  form: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: isSmallDevice ? 20 : 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A3A4A",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#333333",
  },
  predictionsList: {
    maxHeight: height * 0.5,
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  predictionText: {
    flex: 1,
    marginLeft: 12,
  },
  predictionMain: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
  },
  predictionSecondary: {
    fontSize: 13,
    color: "#666666",
    marginTop: 2,
  },
  noResults: {
    textAlign: "center",
    color: "#999999",
    paddingVertical: 30,
    fontSize: 14,
  },
});

export default DeliveryDetails;
