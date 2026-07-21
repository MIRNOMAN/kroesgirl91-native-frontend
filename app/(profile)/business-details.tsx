import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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

export default function BusinessDetailsScreen() {
  const router = useRouter();

  const { data: meData, isLoading: isFetching } = useGetMeUserQuery();
  const [updateMeUser, { isLoading: isUpdating }] = useUpdateMeUserMutation();

  const [businessName, setBusinessName] = useState("");
  const [businessAddressLine1, setBusinessAddressLine1] = useState("");
  const [businessLatitude1, setBusinessLatitude1] = useState(0);
  const [businessLongitude1, setBusinessLongitude1] = useState(0);
  const [businessAddressLine2, setBusinessAddressLine2] = useState("");
  const [businessLatitude2, setBusinessLatitude2] = useState(0);
  const [businessLongitude2, setBusinessLongitude2] = useState(0);

  const [mapPickerVisible, setMapPickerVisible] = useState(false);
  const [activeMapField, setActiveMapField] = useState<
    "businessAddress1" | "businessAddress2"
  >("businessAddress1");

  useEffect(() => {
    if (meData?.data) {
      const d = meData.data;
      setBusinessName(d.businessName ?? "");
      setBusinessAddressLine1(d.businessAddressLine1 ?? "");
      setBusinessLatitude1(d.businessLatitude1 ?? 0);
      setBusinessLongitude1(d.businessLongitude1 ?? 0);
      setBusinessAddressLine2(d.businessAddressLine2 ?? "");
      setBusinessLatitude2(d.businessLatitude2 ?? 0);
      setBusinessLongitude2(d.businessLongitude2 ?? 0);
    }
  }, [meData]);

  const openMapPicker = (field: "businessAddress1" | "businessAddress2") => {
    setActiveMapField(field);
    setMapPickerVisible(true);
  };

  const getMapPickerInitial = () => {
    if (activeMapField === "businessAddress1") {
      return {
        lat: businessLatitude1 || 5.852,
        lng: businessLongitude1 || -55.203,
      };
    }
    return {
      lat: businessLatitude2 || 5.852,
      lng: businessLongitude2 || -55.203,
    };
  };

  const getMapPickerTitle = () => {
    return activeMapField === "businessAddress1"
      ? "Pick Business Address 1"
      : "Pick Business Address 2";
  };

  const handleMapConfirm = (result: MapPickerResult) => {
    if (activeMapField === "businessAddress1") {
      setBusinessAddressLine1(result.address);
      setBusinessLatitude1(result.latitude);
      setBusinessLongitude1(result.longitude);
    } else {
      setBusinessAddressLine2(result.address);
      setBusinessLatitude2(result.latitude);
      setBusinessLongitude2(result.longitude);
    }
  };

  const handleSave = async () => {
    if (!businessName.trim()) {
      toast.warning("Business name cannot be empty");
      return;
    }

    if (!businessAddressLine1.trim()) {
      toast.warning("Business address is required");
      return;
    }

    try {
      await updateMeUser({
        data: {
          businessName: businessName.trim(),
          businessAddressLine1: businessAddressLine1.trim(),
          businessLatitude1,
          businessLongitude1,
          businessAddressLine2: businessAddressLine2.trim() || null,
          businessLatitude2: businessLatitude2 || null,
          businessLongitude2: businessLongitude2 || null,
        },
        profile: undefined,
      }).unwrap();

      toast.success("Business details updated successfully");
      router.back();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update business details.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileHeader
        title="Business Details"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Merchant Badge */}
        <View style={styles.merchantBadge}>
          <Feather name="briefcase" size={18} color="#003C52" />
          <Text style={styles.merchantBadgeText}>Merchant Account</Text>
        </View>

        <View style={styles.form}>
          {/* Business Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name</Text>
            <View style={styles.inputWrapper}>
              <Feather
                name="briefcase"
                size={18}
                color="#FEB334"
                style={styles.inputIcon}
              />
              <Text style={styles.input}>
                {isFetching ? "Loading..." : businessName || "—"}
              </Text>
            </View>
          </View>

          {/* Business Address 1 */}
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
                {businessAddressLine1 || "Tap to select business address on map"}
              </Text>
            </Pressable>
          </View>

          {/* Business Address 2 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Address 2 (Optional)</Text>
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
      </ScrollView>

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
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
