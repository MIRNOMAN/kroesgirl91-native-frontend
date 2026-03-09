import { useRouter } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LogoutButton,
  ProfileCard,
  ProfileMenuItem,
  ProfileMenuSection,
} from "../../components/ui/profile";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useGetMeUserQuery } from "../../redux/api/userApi";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=11";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data, isLoading } = useGetMeUserQuery();

  const handleLogout = () => {
    signOut();
    router.replace(APP_ROUTES.login);
  };

  const profile = data?.data;
  const userData = {
    name: profile?.fullName || "User",
    email: profile?.email || "Not provided",
    phone: profile?.phone || "Not provided",
    avatar: profile?.profileImage || DEFAULT_AVATAR,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Text style={styles.headerTitle}>Profile</Text>

            {/* Profile Card */}
            {isLoading ? (
              <View style={styles.profileSkeletonCard}>
                <View style={styles.profileSkeletonTopRow}>
                  <View style={styles.profileSkeletonAvatar} />
                  <View style={styles.profileSkeletonTextWrap}>
                    <View style={styles.skeletonNameLine} />
                    <View style={styles.skeletonEmailLine} />
                    <View style={styles.skeletonPhoneLine} />
                  </View>
                </View>
              </View>
            ) : (
              <ProfileCard
                name={userData.name}
                email={userData.email}
                phone={userData.phone}
                // avatar={userData.avatar}
                onEditPress={() => router.push(APP_ROUTES.editProfile)}
              />
            )}

            {/* Support & Help Section */}
            <ProfileMenuSection title="Support & Help">
              <ProfileMenuItem
                icon="info"
                title="About Us"
                onPress={() => router.push(APP_ROUTES.aboutUs)}
              />
              <ProfileMenuItem
                icon="lock"
                title="Change Password"
                onPress={() => router.push(APP_ROUTES.changePassword)}
              />
              <ProfileMenuItem
                icon="file-text"
                title="Terms & Conditions"
                onPress={() => router.push(APP_ROUTES.termsConditions)}
              />
              <ProfileMenuItem
                icon="shield"
                title="Privacy Policy"
                onPress={() => router.push(APP_ROUTES.privacyPolicy)}
                showBorder={false}
              />
            </ProfileMenuSection>

            {/* Logout Button */}
            <LogoutButton onPress={handleLogout} />
          </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  headerTitle: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 20,
    marginTop: 8,
  },
  profileSkeletonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileSkeletonTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileSkeletonAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
    backgroundColor: "#E9ECEF",
  },
  profileSkeletonTextWrap: {
    flex: 1,
    gap: 10,
  },
  skeletonNameLine: {
    width: "60%",
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E9ECEF",
  },
  skeletonEmailLine: {
    width: "80%",
    height: 14,
    borderRadius: 8,
    backgroundColor: "#ECEFF1",
  },
  skeletonPhoneLine: {
    width: "50%",
    height: 14,
    borderRadius: 8,
    backgroundColor: "#ECEFF1",
  },
});
