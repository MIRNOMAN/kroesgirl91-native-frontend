import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const SURINAME_BOUNDS = {
  minLat: 1.8,
  maxLat: 6.2,
  minLng: -58.0,
  maxLng: -53.9,
};

const SURINAME_CENTER = {
  latitude: 3.9,
  longitude: -56.0,
  latitudeDelta: 4.5,
  longitudeDelta: 4.5,
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const movePlusCodeToEnd = (address: string): string => {
  const plusCodeRegex = /^[A-Z0-9]{4,}\+?[A-Z0-9]*,?\s*/;
  const match = address.match(plusCodeRegex);
  if (match) {
    const withoutPlusCode = address.slice(match[0].length).trim();
    const plusCode = match[0].replace(/,?\s*$/, "").trim();
    return `${withoutPlusCode} ${plusCode}`;
  }
  return address;
};

export type MapPickerResult = {
  latitude: number;
  longitude: number;
  address: string;
};

type MapPickerProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (result: MapPickerResult) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  title?: string;
  countryCode?: string;
};

type PlaceSuggestion = {
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

const MapPicker: React.FC<MapPickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialLatitude = 5.852,
  initialLongitude = -55.203,
  title = "Pick Location",
  countryCode = "SR",
}) => {
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState({
    latitude: SURINAME_CENTER.latitude,
    longitude: SURINAME_CENTER.longitude,
    latitudeDelta: SURINAME_CENTER.latitudeDelta,
    longitudeDelta: SURINAME_CENTER.longitudeDelta,
  });

  const [selectedAddress, setSelectedAddress] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (visible) {
      setRegion({
        latitude: clamp(
          initialLatitude,
          SURINAME_BOUNDS.minLat,
          SURINAME_BOUNDS.maxLat,
        ),
        longitude: clamp(
          initialLongitude,
          SURINAME_BOUNDS.minLng,
          SURINAME_BOUNDS.maxLng,
        ),
        latitudeDelta: SURINAME_CENTER.latitudeDelta,
        longitudeDelta: SURINAME_CENTER.longitudeDelta,
      });
      setSelectedAddress("");
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [visible, initialLatitude, initialLongitude]);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      setGeocoding(true);
      const url =
        `https://maps.googleapis.com/maps/api/geocode/json` +
        `?latlng=${lat},${lng}` +
        `&key=${GOOGLE_API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

        if (data.status === "OK" && data.results.length > 0) {
          setSelectedAddress(movePlusCodeToEnd(data.results[0].formatted_address));
        }
    } catch (err) {
      console.error("Reverse geocode error:", err);
    } finally {
      setGeocoding(false);
    }
  }, []);

  const handleRegionChangeComplete = useCallback(
    (newRegion: any) => {
      const clampedLat = clamp(
        newRegion.latitude,
        SURINAME_BOUNDS.minLat,
        SURINAME_BOUNDS.maxLat,
      );
      const clampedLng = clamp(
        newRegion.longitude,
        SURINAME_BOUNDS.minLng,
        SURINAME_BOUNDS.maxLng,
      );

      setRegion((prev) => ({
        ...prev,
        latitude: clampedLat,
        longitude: clampedLng,
      }));
      reverseGeocode(clampedLat, clampedLng);
    },
    [reverseGeocode],
  );

  const searchPlaces = useCallback(
    async (query: string) => {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        setSearching(true);
        const url =
          `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
          `?input=${encodeURIComponent(query)}` +
          `&components=country:${countryCode}` +
          `&key=${GOOGLE_API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK") {
          setSuggestions([]);
          return;
        }

        setSuggestions(
          data.predictions.map((p: any) => ({
            id: p.place_id,
            description: p.description,
            mainText: p.structured_formatting?.main_text || "",
            secondaryText: p.structured_formatting?.secondary_text || "",
          })),
        );
      } catch (err) {
        console.error("Places autocomplete error:", err);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    },
    [countryCode],
  );

  const handleSelectSuggestion = useCallback(
    async (suggestion: PlaceSuggestion) => {
      try {
        setShowSuggestions(false);
        setSearchQuery(suggestion.mainText);

        const url =
          `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${suggestion.id}` +
          `&fields=geometry,formatted_address` +
          `&key=${GOOGLE_API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "OK") {
          const { lat, lng } = data.result.geometry.location;
          setSelectedAddress(movePlusCodeToEnd(data.result.formatted_address));
          mapRef.current?.animateToRegion(
            {
              latitude: clamp(
                lat,
                SURINAME_BOUNDS.minLat,
                SURINAME_BOUNDS.maxLat,
              ),
              longitude: clamp(
                lng,
                SURINAME_BOUNDS.minLng,
                SURINAME_BOUNDS.maxLng,
              ),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            300,
          );
        }
      } catch (err) {
        console.error("Place details error:", err);
      }
    },
    [],
  );

  const handleUseCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      const lat = clamp(
        location.coords.latitude,
        SURINAME_BOUNDS.minLat,
        SURINAME_BOUNDS.maxLat,
      );
      const lng = clamp(
        location.coords.longitude,
        SURINAME_BOUNDS.minLng,
        SURINAME_BOUNDS.maxLng,
      );

      mapRef.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        300,
      );
    } catch (err) {
      console.error("Get current location error:", err);
    }
  }, []);

  const handleConfirm = () => {
    const lat = clamp(
      region.latitude,
      SURINAME_BOUNDS.minLat,
      SURINAME_BOUNDS.maxLat,
    );
    const lng = clamp(
      region.longitude,
      SURINAME_BOUNDS.minLng,
      SURINAME_BOUNDS.maxLng,
    );

    onConfirm({
      latitude: lat,
      longitude: lng,
      address: selectedAddress,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation={false}
          />

          <View style={styles.centerMarker}>
            <Ionicons name="location" size={36} color="#EF4444" />
            <View style={styles.markerShadow} />
          </View>

          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search location..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchPlaces(text);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {searching && <ActivityIndicator size="small" color="#F59E0B" />}
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => {
                    setSearchQuery("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </Pressable>
              )}
            </View>

            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestionsList}>
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#F59E0B"
                    />
                    <View style={styles.suggestionText}>
                      <Text style={styles.suggestionMain} numberOfLines={1}>
                        {item.mainText}
                      </Text>
                      <Text
                        style={styles.suggestionSecondary}
                        numberOfLines={1}>
                        {item.secondaryText}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.myLocationButton}
            onPress={handleUseCurrentLocation}>
            <Ionicons name="locate" size={20} color="#003C52" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.addressRow}>
            {geocoding ? (
              <ActivityIndicator size="small" color="#F59E0B" />
            ) : (
              <Ionicons name="pin-outline" size={16} color="#F59E0B" />
            )}
            <Text style={styles.addressText} numberOfLines={2}>
              {selectedAddress || "Move the map to select a location"}
            </Text>
          </View>

          <View style={styles.coordinatesText}>
            <Text style={styles.coordLabel}>
              {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.bottomButtons}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[
                styles.confirmButton,
                geocoding && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={geocoding}>
              <Ionicons name="checkmark-circle" size={18} color="#FFF" />
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </Pressable>
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={22} color="#333" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default MapPicker;

const MARKER_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    height: "110%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centerMarker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -MARKER_SIZE,
    marginLeft: -(MARKER_SIZE / 2),
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  markerShadow: {
    position: "absolute",
    bottom: -4,
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  searchBarContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    left: 16,
    right: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 15,
    color: "#333",
  },
  suggestionsList: {
    marginTop: 6,
    backgroundColor: "#FFF",
    borderRadius: 12,
    maxHeight: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  suggestionText: {
    flex: 1,
    marginLeft: 10,
  },
  suggestionMain: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  suggestionSecondary: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  myLocationButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomBar: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  coordinatesText: {
    marginBottom: 16,
  },
  coordLabel: {
    fontSize: 12,
    color: "#999",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  bottomButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    flex: 2,
    flexDirection: "row",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#003C52",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});
