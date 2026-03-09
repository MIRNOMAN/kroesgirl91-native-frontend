import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);

  useEffect(() => {
    if (meData?.data) {
      setFullName(meData.data.fullName ?? "");
      setPhone(meData.data.phone ?? "");
    }
  }, [meData]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setLocalImage(asset.uri);
      const fileName = asset.uri.split("/").pop() ?? "profile.jpg";
      const match = /\.(\w+)$/.exec(fileName);
      const type = match ? `image/${match[1]}` : "image/jpeg";
      setImageFile({ uri: asset.uri, name: fileName, type });
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation", "Full name cannot be empty.");
      return;
    }
    try {
      await updateMeUser({
        data: { fullName: fullName.trim(), phone: phone.trim() },
        profile: imageFile ?? undefined,
      }).unwrap();
      Alert.alert("Success", "Profile updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.data?.message ?? "Failed to update profile.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            {/* Header */}
            <ProfileHeader
              title="Edit Profile"
              showBackButton
              onBackPress={() => router.back()}
            />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    localImage
                      ? { uri: localImage }
                      : meData?.data?.profileImage
                        ? { uri: meData.data.profileImage }
                        : { uri: "https://i.pravatar.cc/150?img=11" }
                  }
                  style={styles.avatar}
                />
                <TouchableOpacity
                  style={styles.editAvatarButton}
                  onPress={handlePickImage}
                >
                  <Feather name="edit-3" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Email (read-only) */}
              <View style={styles.emailBadge}>
                <Feather name="mail" size={15} color="#FEB334" />
                <Text style={styles.emailText} numberOfLines={1}>
                  {meData?.data?.email ?? "—"}
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Full Name */}
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

                {/* Phone */}
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
              </View>
            </ScrollView>

            {/* Save Button */}
            <View style={styles.bottomSection}>
              <Pressable
                style={[
                  styles.saveButton,
                  isUpdating && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={isUpdating || isFetching}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#FEB334",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FEB334",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  emailBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFF8EC",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 28,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FEB33440",
  },
  emailText: {
    fontSize: 14,
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
