import { Image } from "expo-image";
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
          <Image
            source={require("../../assets/register/register.png")}
            style={styles.badgeImage}
            contentFit="contain"
          />
        </View>

        <Text style={styles.title}>Successfully Registered</Text>
        <Text style={styles.subtitle}>
          Your account has been registered successfully, now let&apos;s enjoy
          Car features!
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
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 20,
  },
  badgeImage: {
    width: 220,
    height: 220,
  },
  badge: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.onboardingPrimary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
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
