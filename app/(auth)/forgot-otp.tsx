import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import AuthButton from "../../components/ui/auth/AuthButton";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import OtpCodeInput from "../../components/ui/auth/OtpCodeInput";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function ForgotOtpScreen() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AuthTitleBlock
          title="Apply Reset Code"
          subtitle="Please check your email. Give correct reset 4 digit code here."
          titleSize={31}
          subtitleSize={11}
          subtitleMaxWidth={240}
        />

        <OtpCodeInput value={otpValue} onChange={setOtpValue} length={4} />
      </View>

      <View style={styles.actions}>
        <AuthButton
          title="Apply Code"
          onPress={() => router.push(APP_ROUTES.resetPassword)}
        />
        <AuthButton
          title="Send Email Again"
          variant="secondary"
          onPress={() => setOtpValue("")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.authBg,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  content: {
    gap: 24,
    alignItems: "center",
  },
  actions: {
    gap: 10,
  },
});
