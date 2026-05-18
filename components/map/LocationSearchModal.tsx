import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface PlacePrediction {
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
  latitude?: number;
  longitude?: number;
}

interface GooglePlacesSearchProps {
  visible: boolean;
  onClose: () => void;
  value?: string;
  countryCode?: string; // default = SR
  placeholder?: string;
  title?: string;
  onSelect: (place: PlacePrediction) => void;
}

const GooglePlacesSearch: React.FC<GooglePlacesSearchProps> = ({
  visible,
  onClose,
  value = "",
  countryCode = "SR", // Suriname only
  placeholder = "Search address...",
  title = "Search Location",
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  const searchPlaces = useCallback(
    async (query: string) => {
      if (query.trim().length < 3) {
        setPredictions([]);
        return;
      }

      try {
        setLoading(true);

        const url =
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
          `input=${encodeURIComponent(query)}` +
          `&components=country:${countryCode}` +
          `&key=${GOOGLE_API_KEY}`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.status !== "OK") {
          setPredictions([]);
          return;
        }

        const mappedPredictions: PlacePrediction[] = result.predictions.map(
          (item: any) => ({
            id: item.place_id,
            description: item.description,
            mainText: item.structured_formatting?.main_text || "",
            secondaryText: item.structured_formatting?.secondary_text || "",
          }),
        );

        setPredictions(mappedPredictions);
      } catch (error) {
        console.error("Google Places Error:", error);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    },
    [countryCode],
  );

  const getPlaceDetails = async (placeId: string) => {
    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}` +
        `&fields=geometry` +
        `&key=${GOOGLE_API_KEY}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.status === "OK") {
        return {
          latitude: result.result.geometry.location.lat,
          longitude: result.result.geometry.location.lng,
        };
      }

      return {};
    } catch (error) {
      console.error("Place Details Error:", error);
      return {};
    }
  };

  const handleSelect = async (place: PlacePrediction) => {
    const coords = await getPlaceDetails(place.id);

    onSelect({
      ...place,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    // setSearchQuery("");
    // setPredictions([]);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      // default initial suggestions (cities / places)
      searchPlaces("city");
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>

              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" />

              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                autoFocus
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchPlaces(text);
                }}
              />

              {loading && <ActivityIndicator size="small" color="#F5A623" />}
            </View>

            {/* Results */}
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}>
                  <Ionicons name="location-outline" size={20} color="#F5A623" />

                  <View style={styles.itemText}>
                    <Text style={styles.mainText}>{item.mainText}</Text>

                    <Text style={styles.secondaryText}>
                      {item.secondaryText}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                searchQuery.length >= 3 && !loading ? (
                  <Text style={styles.noResults}>No locations found</Text>
                ) : null
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default GooglePlacesSearch;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },

  modalContent: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A3A4A",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#333",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  itemText: {
    flex: 1,
    marginLeft: 12,
  },

  mainText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },

  secondaryText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  noResults: {
    textAlign: "center",
    paddingVertical: 30,
    color: "#999",
  },
});
