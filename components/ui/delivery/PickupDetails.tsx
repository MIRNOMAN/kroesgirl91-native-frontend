import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
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

const TOOKAN_MAP_DEFAULT_KEY =
  process.env.EXPO_PUBLIC_TOOKAN_MAP_KEY ??
  process.env.EXPO_PUBLIC_MAPPR_KEY ??
  "bc2706f0-28d7-11f1-a301-ede322482ab2";
const TOOKAN_MAP_WEB_KEY =
  process.env.EXPO_PUBLIC_TOOKAN_MAP_WEB_KEY ??
  process.env.EXPO_PUBLIC_MAPPR_WEB_KEY ??
  TOOKAN_MAP_DEFAULT_KEY;
const TOOKAN_MAP_ANDROID_KEY =
  process.env.EXPO_PUBLIC_TOOKAN_MAP_ANDROID_KEY ??
  process.env.EXPO_PUBLIC_MAPPR_ANDROID_KEY ??
  TOOKAN_MAP_DEFAULT_KEY;
const TOOKAN_MAP_IOS_KEY =
  process.env.EXPO_PUBLIC_TOOKAN_MAP_IOS_KEY ??
  process.env.EXPO_PUBLIC_MAPPR_IOS_KEY ??
  TOOKAN_MAP_DEFAULT_KEY;
const TOOKAN_MAP_SERVER_KEY =
  process.env.EXPO_PUBLIC_TOOKAN_MAP_SERVER_KEY ??
  process.env.EXPO_PUBLIC_MAPPR_SERVER_KEY ??
  TOOKAN_MAP_DEFAULT_KEY;
const TOOKAN_MAP_FORM_KEY =
  process.env.EXPO_PUBLIC_TOOKAN_MAP_FORM_KEY ??
  process.env.EXPO_PUBLIC_MAPPR_FORM_KEY ??
  TOOKAN_MAP_DEFAULT_KEY;

const getTookanMapKey = () => {
  if (Platform.OS === "android") {
    return TOOKAN_MAP_ANDROID_KEY || TOOKAN_MAP_SERVER_KEY;
  }

  if (Platform.OS === "ios") {
    return TOOKAN_MAP_IOS_KEY || TOOKAN_MAP_SERVER_KEY;
  }

  return TOOKAN_MAP_WEB_KEY || TOOKAN_MAP_FORM_KEY || TOOKAN_MAP_SERVER_KEY;
};

const TOOKAN_MAP_ACCESS_TOKEN = getTookanMapKey();
const TOOKAN_MAP_API_BASE_URL =
  process.env.EXPO_PUBLIC_TOOKAN_MAP_API_BASE_URL ||
  process.env.EXPO_PUBLIC_MAPPR_API_BASE_URL ||
  "https://maps.flightmap.io/api";

interface PickupData {
  fullName: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
}

interface PickupDetailsProps {
  title: string;
  subtitle: string;
  data: PickupData;
  onDataChange: (data: PickupData) => void;
  onNext: () => void;
}

interface PlacePrediction {
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
  latitude?: number;
  longitude?: number;
}

const PickupDetails: React.FC<PickupDetailsProps> = ({
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

  const openLocationSearch = () => {
    setShowLocationModal(true);
    setSearchQuery(data.fullAddress);
    if (data.fullAddress.trim().length >= 3) {
      searchPlaces(data.fullAddress);
    }
  };

  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        text: query.trim(),
        currentlatitude: String(data.latitude ?? 23.8103),
        currentlongitude: String(data.longitude ?? 90.4125),
        skip_cache: "0",
        fm_token: TOOKAN_MAP_ACCESS_TOKEN,
        radius: "0",
        offering: "3",
        language: "en",
      });

      const response = await fetch(
        `${TOOKAN_MAP_API_BASE_URL}/search?${params.toString()}`,
      );
      const result = await response.json();

      const mappedPredictions: PlacePrediction[] = Array.isArray(result?.data)
        ? result.data
            .map((item: any, index: number) => ({
              id: String(item.id || item.name || index),
              description: item.address || item.name || "",
              mainText: item.name || item.address || "",
              secondaryText: item.address || "",
              latitude:
                typeof item.lat === "number"
                  ? item.lat
                  : Number(item.position?.lat),
              longitude:
                typeof item.lng === "number"
                  ? item.lng
                  : Number(item.position?.lng),
            }))
            .filter((item: PlacePrediction) => item.description)
        : [];

      setPredictions(mappedPredictions);
    } catch (error) {
      console.error("Error searching Tookan map places:", error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const selectPlace = (place: PlacePrediction) => {
    onDataChange({
      ...data,
      fullAddress: place.description,
      latitude: place.latitude,
      longitude: place.longitude,
    });
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
          label="Store Name"
          placeholder="Enter store name"
          value={data.fullName}
          onChangeText={(text) => onDataChange({ ...data, fullName: text })}
          icon="person-outline"
        />

        <DeliveryInput
          label="Store Phone Number"
          placeholder="Enter store phone number"
          value={data.phoneNumber}
          onChangeText={(text) => onDataChange({ ...data, phoneNumber: text })}
          keyboardType="phone-pad"
          icon="call-outline"
        />

        <DeliveryInput
          label="Store Email"
          placeholder="Enter store email"
          value={data.email}
          onChangeText={(text) => onDataChange({ ...data, email: text })}
          keyboardType="email-address"
          icon="mail-outline"
        />

        <DeliveryInput
          label="Store Address"
          placeholder="Search store address"
          value={data.fullAddress}
          onChangeText={(text) => {
            onDataChange({ ...data, fullAddress: text });
            setSearchQuery(text);
            if (!showLocationModal) {
              setShowLocationModal(true);
            }
            searchPlaces(text);
          }}
          onFocus={openLocationSearch}
          icon="location-outline"
          isLocationInput
          onLocationPress={openLocationSearch}
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
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.predictionItem}
                  onPress={() => selectPlace(item)}
                >
                  <Ionicons name="location-outline" size={20} color="#F5A623" />
                  <View style={styles.predictionText}>
                    <Text style={styles.predictionMain}>{item.mainText}</Text>
                    <Text style={styles.predictionSecondary}>
                      {item.secondaryText}
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
    fontSize: isSmallDevice ? 24 : 24,
    fontWeight: "700",
    color: "#1A3A4A",
    marginBottom: 10,
    marginTop: 25,
  },
  subtitle: {
    fontSize: isSmallDevice ? 15 : 14,
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

export default PickupDetails;
