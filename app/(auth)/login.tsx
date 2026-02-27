import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";
import CustomButton from "../../components/ui/CustomButton";
import CustomInput from "../../components/ui/CustomInput";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Login</Text>
      <CustomInput placeholder="Email" keyboardType="email-address" />
      <CustomInput placeholder="Password" secureTextEntry />
      <CustomButton
        title="Sign In"
        onPress={() => router.replace(APP_ROUTES.home)}
      />
      <CustomButton
        title="Forgot Password"
        onPress={() => router.push(APP_ROUTES.forgotPassword)}
      />
      <CustomButton
        title="Create Account"
        onPress={() => router.push(APP_ROUTES.register)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
});
