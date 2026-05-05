import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import AuthButton from "../../components/ui/auth/AuthButton";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import OtpCodeInput from "../../components/ui/auth/OtpCodeInput";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function OtpScreen() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");

  const handleApplyCode = () => {
    const normalizedOtp = otpValue.trim();

    if (!normalizedOtp || normalizedOtp.length !== 4) {
      toast.warning("Please enter valid 4 digit OTP");
      return;
    }

    router.push(`${APP_ROUTES.verifyOtp}?otp=${normalizedOtp}` as never);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.authBg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/login/login_icons.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <AuthTitleBlock
                title="Apply Code Here"
                subtitle="Please check your email. Give correct authentication code here."
              />

              <OtpCodeInput
                value={otpValue}
                onChange={setOtpValue}
                length={4}
              />
            </View>

            <View style={styles.actions}>
              <AuthButton title="Apply Code" onPress={handleApplyCode} />

              <AuthButton
                title="Send Email Again"
                variant="secondary"
                onPress={() => setOtpValue("")}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    gap: 28,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 530,
    height: 100,
  },
  actions: {
    gap: 10,
  },
});
