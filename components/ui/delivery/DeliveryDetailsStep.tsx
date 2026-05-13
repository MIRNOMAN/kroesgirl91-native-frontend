import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

import GooglePlacesSearch from "@/components/map/LocationSearchModal";
import DeliveryButton from "./DeliveryButton";
import DeliveryInput from "./DeliveryInput";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface DeliveryData {
  name: string;
  phoneNumber: string;
  email: string;
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
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
  latitude?: number;
  longitude?: number;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  title,
  subtitle,
  data,
  onDataChange,
  onNext,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const openLocationSearch = () => {
    setShowLocationModal(true);
  };

  const selectPlace = (place: PlacePrediction) => {
    onDataChange({
      ...data,
      fullAddress: place.description,
      latitude: place.latitude,
      longitude: place.longitude,
    });
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
          placeholder="Search address"
          value={data.fullAddress}
          onChangeText={(text) => onDataChange({ ...data, fullAddress: text })}
          onFocus={openLocationSearch}
          onPress={openLocationSearch}
          icon="location-outline"
          isLocationInput
          onLocationPress={openLocationSearch}
        />
      </View>

      <View style={styles.buttonContainer}>
        <DeliveryButton title="Next" onPress={onNext} />
      </View>

      {/* ✅ NEW GOOGLE PLACES MODAL */}
      <GooglePlacesSearch
        visible={showLocationModal}
        value={data.fullAddress}
        countryCode="SR"
        title="Search Location"
        placeholder="Search for address..."
        onClose={() => setShowLocationModal(false)}
        onSelect={(place) => {
          selectPlace(place);
          setShowLocationModal(false);
        }}
      />
    </View>
  );
};

export default DeliveryDetails;

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
});
