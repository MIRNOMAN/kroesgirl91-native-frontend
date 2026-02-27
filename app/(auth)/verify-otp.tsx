import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import AuthButton from "../../components/ui/auth/AuthButton";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function VerifyOtpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons
            name="cube"
            size={58}
            color={COLORS.authAccent}
            style={styles.boxIcon}
          />
          <View style={styles.badge}>
            <Ionicons name="checkmark" size={13} color={COLORS.white} />
          </View>
        </View>

        <Text style={styles.title}>Successfully Registered</Text>
        <Text style={styles.subtitle}>
          Your account has been registered successfully, now let's enjoy Car
          features!
        </Text>
      </View>

      <AuthButton
        title="Go to Home"
        onPress={() => router.replace(APP_ROUTES.home)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.authBg,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.authInput,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  boxIcon: {
    transform: [{ rotate: "-18deg" }],
  },
  badge: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.onboardingPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: 290,
  },
});
