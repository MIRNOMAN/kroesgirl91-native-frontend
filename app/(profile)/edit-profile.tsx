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

  const [businessName, setBusinessName] = useState("");
  const [businessAddressLine1, setBusinessAddressLine1] = useState("");
  const [businessLatitude1, setBusinessLatitude1] = useState(0);
  const [businessLongitude1, setBusinessLongitude1] = useState(0);
  const [businessAddressLine2, setBusinessAddressLine2] = useState("");
  const [businessLatitude2, setBusinessLatitude2] = useState(0);
  const [businessLongitude2, setBusinessLongitude2] = useState(0);

  const [mapPickerVisible, setMapPickerVisible] = useState(false);
  const [activeMapField, setActiveMapField] = useState<
    "userAddress" | "businessAddress1" | "businessAddress2"
  >("userAddress");

  const isMerchant = meData?.data?.role === "MERCHANT";

  useEffect(() => {
    if (meData?.data) {
      const d = meData.data;
      setFullName(d.fullName ?? "");
      setPhone(d.phone ?? "");
      setAddress(d.address ?? "");
      setLatitude(d.latitude ?? 0);
      setLongitude(d.longitude ?? 0);

      if (d.role === "MERCHANT") {
        setBusinessName(d.businessName ?? "");
        setBusinessAddressLine1(d.businessAddressLine1 ?? "");
        setBusinessLatitude1(d.businessLatitude1 ?? 0);
        setBusinessLongitude1(d.businessLongitude1 ?? 0);
        setBusinessAddressLine2(d.businessAddressLine2 ?? "");
        setBusinessLatitude2(d.businessLatitude2 ?? 0);
        setBusinessLongitude2(d.businessLongitude2 ?? 0);
      }
    }
  }, [meData]);

  const openMapPicker = (
    field: "userAddress" | "businessAddress1" | "businessAddress2",
  ) => {
    setActiveMapField(field);
    setMapPickerVisible(true);
  };

  const getMapPickerInitial = () => {
    switch (activeMapField) {
      case "businessAddress1":
        return {
          lat: businessLatitude1 || 5.852,
          lng: businessLongitude1 || -55.203,
        };
      case "businessAddress2":
        return {
          lat: businessLatitude2 || 5.852,
          lng: businessLongitude2 || -55.203,
        };
      default:
        return {
          lat: latitude || 5.852,
          lng: longitude || -55.203,
        };
    }
  };

  const getMapPickerTitle = () => {
    switch (activeMapField) {
      case "businessAddress1":
        return "Pick Business Address 1";
      case "businessAddress2":
        return "Pick Business Address 2";
      default:
        return "Pick Your Address";
    }
  };

  const handleMapConfirm = (result: MapPickerResult) => {
    switch (activeMapField) {
      case "userAddress":
        setAddress(result.address);
        setLatitude(result.latitude);
        setLongitude(result.longitude);
        break;
      case "businessAddress1":
        setBusinessAddressLine1(result.address);
        setBusinessLatitude1(result.latitude);
        setBusinessLongitude1(result.longitude);
        break;
      case "businessAddress2":
        setBusinessAddressLine2(result.address);
        setBusinessLatitude2(result.latitude);
        setBusinessLongitude2(result.longitude);
        break;
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation", "Full name cannot be empty.");
      return;
    }

    try {
      const payload: any = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        latitude,
        longitude,
      };

      if (isMerchant) {
        payload.businessName = businessName.trim();
        payload.businessAddressLine1 = businessAddressLine1.trim();
        payload.businessLatitude1 = businessLatitude1;
        payload.businessLongitude1 = businessLongitude1;
        payload.businessAddressLine2 = businessAddressLine2.trim() || null;
        payload.businessLatitude2 = businessLatitude2 || null;
        payload.businessLongitude2 = businessLongitude2 || null;
      }

      await updateMeUser({
        data: payload,
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

              {isMerchant && (
                <View style={styles.merchantBadge}>
                  <Feather name="briefcase" size={18} color="#003C52" />
                  <Text style={styles.merchantBadgeText}>Merchant Account</Text>
                </View>
              )}

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
                    onPress={() => openMapPicker("userAddress")}>
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

                {/* Merchant Fields */}
                {isMerchant && (
                  <>
                    <View style={styles.divider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>Business Details</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Business Name</Text>
                      <View style={styles.inputWrapper}>
                        <Feather
                          name="briefcase"
                          size={18}
                          color="#FEB334"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.input}
                          value={businessName}
                          onChangeText={setBusinessName}
                          placeholder="Enter business name"
                          placeholderTextColor={COLORS.authPlaceholder}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Business Address 1</Text>
                      <Pressable
                        style={styles.locationInput}
                        onPress={() => openMapPicker("businessAddress1")}>
                        <Feather
                          name="map-pin"
                          size={18}
                          color="#FEB334"
                          style={styles.inputIcon}
                        />
                        <Text
                          style={[
                            styles.locationText,
                            !businessAddressLine1 && styles.placeholderText,
                          ]}
                          numberOfLines={1}>
                          {businessAddressLine1 ||
                            "Tap to select business address on map"}
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Business Address 2 (Optional)
                      </Text>
                      <Pressable
                        style={styles.locationInput}
                        onPress={() => openMapPicker("businessAddress2")}>
                        <Feather
                          name="map-pin"
                          size={18}
                          color="#FEB334"
                          style={styles.inputIcon}
                        />
                        <Text
                          style={[
                            styles.locationText,
                            !businessAddressLine2 && styles.placeholderText,
                          ]}
                          numberOfLines={1}>
                          {businessAddressLine2 ||
                            "Tap to select second address on map"}
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
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
        title={getMapPickerTitle()}
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
  merchantBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#ECFEFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 28,
    gap: 6,
    borderWidth: 1,
    borderColor: "#06B6D440",
  },
  merchantBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003C52",
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  dividerText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#003C52",
    textTransform: "uppercase",
    letterSpacing: 1,
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
