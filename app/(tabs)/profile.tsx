import { useRouter } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
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

export default function ProfileScreen() {
  const router = useRouter();

  const userData = {
    name: "Darrell Steward",
    email: "darrellsteward@example.com",
    phone: "+1 789 234 5678",
    avatar: "https://i.pravatar.cc/150?img=11",
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
            <ProfileCard
              name={userData.name}
              email={userData.email}
              phone={userData.phone}
              avatar={userData.avatar}
              onEditPress={() => router.push(APP_ROUTES.editProfile)}
            />

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
            <LogoutButton onPress={() => router.replace(APP_ROUTES.login)} />
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
});
