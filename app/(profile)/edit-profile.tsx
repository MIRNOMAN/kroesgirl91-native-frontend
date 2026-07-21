import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import MapPicker, { type MapPickerResult } from "../../components/ui/MapPicker";
import { ProfileHeader } from "../../components/ui/profile";
import { COLORS } from "../../constants/colors";
import {
  useGetMeUserQuery,
  useUpdateMeUserMutation,
} from "../../redux/api/userApi";

export default function EditProfileScreen() {
  const router = useRouter();

  const { data: meData, isLoading: isFetching } = useGetMeUserQuery();
  const [updateMeUser, { isLoading: isUpdating }] = useUpdateMeUserMutation();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [mapPickerVisible, setMapPickerVisible] = useState(false);

  useEffect(() => {
    if (meData?.data) {
      const d = meData.data;
      setFullName(d.fullName ?? "");
      setPhone(d.phone ?? "");
      setAddress(d.address ?? "");
      setLatitude(d.latitude ?? 0);
      setLongitude(d.longitude ?? 0);
    }
  }, [meData]);

  const openMapPicker = () => {
    setMapPickerVisible(true);
  };

  const getMapPickerInitial = () => {
    return {
      lat: latitude || 5.852,
      lng: longitude || -55.203,
    };
  };

  const handleMapConfirm = (result: MapPickerResult) => {
    setAddress(result.address);
    setLatitude(result.latitude);
    setLongitude(result.longitude);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation", "Full name cannot be empty.");
      return;
    }

    try {
      await updateMeUser({
        data: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          latitude,
          longitude,
        },
        profile: undefined,
      }).unwrap();

      toast.success("Profile updated successfully");
      router.back();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update profile.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileHeader
        title="Edit Profile"
        showBackButton
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* Email Badge */}
              <View style={styles.emailBadge}>
                <Feather name="mail" size={23} color="#FEB334" />
                <Text style={styles.emailText}>
                  {meData?.data?.email ?? "—"}
                </Text>
              </View>

              {/* Form Fields */}
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="user"
                      size={18}
                      color="#FEB334"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter full name"
                      placeholderTextColor={COLORS.authPlaceholder}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="phone"
                      size={18}
                      color="#FEB334"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Enter phone number"
                      placeholderTextColor={COLORS.authPlaceholder}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Address with MapPicker */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <Pressable
                    style={styles.locationInput}
                    onPress={() => openMapPicker()}>
                    <Feather
                      name="map-pin"
                      size={18}
                      color="#FEB334"
                      style={styles.inputIcon}
                    />
                    <Text
                      style={[
                        styles.locationText,
                        !address && styles.placeholderText,
                      ]}
                      numberOfLines={1}>
                      {address || "Tap to select address on map"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* SAVE BUTTON */}
              <View style={styles.bottomSection}>
                <Pressable
                  style={[
                    styles.saveButton,
                    (isUpdating || isFetching) && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={isUpdating || isFetching}>
                  {isUpdating ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>

      <MapPicker
        visible={mapPickerVisible}
        onClose={() => setMapPickerVisible(false)}
        onConfirm={handleMapConfirm}
        initialLatitude={getMapPickerInitial().lat}
        initialLongitude={getMapPickerInitial().lng}
        title="Pick Your Address"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  emailBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFF8EC",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FEB33440",
  },
  emailText: {
    fontSize: 17,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  form: {
    gap: 22,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  placeholderText: {
    color: COLORS.authPlaceholder,
    fontWeight: "400",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
  },
  saveButton: {
    backgroundColor: "#1A3A4A",
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
