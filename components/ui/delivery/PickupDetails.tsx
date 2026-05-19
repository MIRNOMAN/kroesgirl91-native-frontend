import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

import GooglePlacesSearch from "@/components/map/LocationSearchModal";
import DeliveryButton from "./DeliveryButton";
import DeliveryInput from "./DeliveryInput";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface PickupData {
  fullName: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
  streetNumber?: string;
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

const PickupDetails: React.FC<PickupDetailsProps> = ({
  title,
  subtitle,
  data,
  onDataChange,
  onNext,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const addressRef = React.useRef<TextInput>(null);

  const openLocationSearch = () => {
    addressRef.current?.blur();
    setShowLocationModal(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.form}>
        <DeliveryInput
          label="Name"
          placeholder="Enter name"
          value={data.fullName}
          onChangeText={(text) =>
            onDataChange({
              ...data,
              fullName: text,
            })
          }
          icon="person-outline"
        />

        <DeliveryInput
          label="Store Phone Number"
          placeholder="Enter store phone number"
          value={data.phoneNumber}
          onChangeText={(text) =>
            onDataChange({
              ...data,
              phoneNumber: text,
            })
          }
          keyboardType="phone-pad"
          icon="call-outline"
        />

        <DeliveryInput
          ref={addressRef}
          label="Store Address"
          placeholder="Search store address"
          value={data.fullAddress}
          onChangeText={(text) => {
            onDataChange({
              ...data,
              fullAddress: text,
            });
          }}
          onFocus={openLocationSearch}
          onPress={openLocationSearch}
          icon="location-outline"
          isLocationInput
          onLocationPress={openLocationSearch}
        />

        <DeliveryInput
          label="Street / House No."
          placeholder="Enter street or house number"
          value={data.streetNumber || ""}
          onChangeText={(text) =>
            onDataChange({
              ...data,
              streetNumber: text,
            })
          }
          keyboardType="default"
          icon="home-outline"
        />

        {/* <DeliveryInput
          label="Store Email"
          placeholder="Enter store email"
          value={data.email}
          onChangeText={(text) =>
            onDataChange({
              ...data,
              email: text,
            })
          }
          keyboardType="email-address"
          icon="mail-outline"
        /> */}
      </View>

      <View style={styles.buttonContainer}>
        <DeliveryButton title="Next" onPress={onNext} />
      </View>

      {/* Reusable Google Places Modal */}
      <GooglePlacesSearch
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        value={data.fullAddress}
        countryCode="SR"
        onSelect={(place) => {
          console.log({ place });
          onDataChange({
            ...data,
            fullAddress: place.description,
            latitude: place.latitude,
            longitude: place.longitude,
          });
        }}
      />
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
});

export default PickupDetails;
