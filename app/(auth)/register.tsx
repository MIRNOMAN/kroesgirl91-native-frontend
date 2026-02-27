import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";
import CustomButton from "../../components/ui/CustomButton";
import CustomInput from "../../components/ui/CustomInput";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Register</Text>
      <CustomInput placeholder="Full Name" />
      <CustomInput placeholder="Email" keyboardType="email-address" />
      <CustomInput placeholder="Password" secureTextEntry />
      <CustomButton
        title="Register"
        onPress={() => router.push(APP_ROUTES.otp)}
      />
      <CustomButton
        title="Back to Login"
        onPress={() => router.push(APP_ROUTES.login)}
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
