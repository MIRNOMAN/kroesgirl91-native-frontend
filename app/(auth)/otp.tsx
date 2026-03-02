import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "../../components/ui/auth/AuthButton";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import OtpCodeInput from "../../components/ui/auth/OtpCodeInput";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function OtpScreen() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.authBg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <View style={styles.content}>
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
              <AuthButton
                title="Apply Code"
                onPress={() => router.push(APP_ROUTES.verifyOtp)}
              />
              
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
  actions: {
    gap: 10,
  },
});
