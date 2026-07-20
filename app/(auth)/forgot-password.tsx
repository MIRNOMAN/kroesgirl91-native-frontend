import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView, // Already imported, now properly implemented
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import AuthLabeledInput from "../../components/ui/auth/AuthLabeledInput";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";
import { useUserForgotPasswordMutation } from "../../redux/api/userApi";

const FORGOT_IDENTIFIER_STORAGE_KEY = "forgot_password_identifier";
const FORGOT_METHOD_STORAGE_KEY = "forgot_password_method";

type ForgotPasswordErrorShape = {
  data?: {
    message?: string;
  };
  error?: string;
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [userForgotPassword, { isLoading }] = useUserForgotPasswordMutation();

  const detectInputType = (value: string): "email" | "phone" => {
    return value.includes("@") ? "email" : "phone";
  };

  const getErrorMessage = (error: unknown) => {
    const parsedError = error as ForgotPasswordErrorShape;
    return (
      parsedError?.data?.message ||
      parsedError?.error ||
      "Failed to send OTP. Please try again."
    );
  };

  const saveIdentifierToLocalStorage = async (value: string, method: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.setItem(FORGOT_IDENTIFIER_STORAGE_KEY, value);
      window.localStorage.setItem(FORGOT_METHOD_STORAGE_KEY, method);
      return;
    }
    await AsyncStorage.setItem(FORGOT_IDENTIFIER_STORAGE_KEY, value);
    await AsyncStorage.setItem(FORGOT_METHOD_STORAGE_KEY, method);
  };

  const handleSendOtp = async () => {
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      toast.warning("Email or phone is required");
      return;
    }

    const inputType = detectInputType(trimmedIdentifier);

    try {
      const payload =
        inputType === "email"
          ? { email: trimmedIdentifier.toLowerCase() }
          : { phone: trimmedIdentifier };

      const response = await userForgotPassword(payload).unwrap();

      await saveIdentifierToLocalStorage(
        inputType === "email" ? trimmedIdentifier.toLowerCase() : trimmedIdentifier,
        inputType,
      );
      toast.success(response?.message || "OTP sent successfully");
      router.push(APP_ROUTES.forgotOtp);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <AuthTitleBlock
                title="Forget Password"
                subtitle="Enter your email or phone number to reset your password"
                titleSize={31}
                subtitleSize={16}
                subtitleMaxWidth={260}
              />

              <AuthLabeledInput
                label="Email or Phone"
                placeholder="Enter Email or Phone Number"
                keyboardType="default"
                autoCapitalize="none"
                value={identifier}
                onChangeText={setIdentifier}
                autoCorrect={false}
                compact
              />
            </View>

            <Pressable
              className="btn-primary"
              onPress={handleSendOtp}
              disabled={isLoading}
              style={({ pressed }) => [
                { opacity: pressed || isLoading ? 0.7 : 1 },
              ]}>
              <Text className="btn-text">
                {isLoading ? "Sending..." : "Send OTP"}
              </Text>
            </Pressable>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.authBg,
  },
  scrollContainer: {
    // flexGrow: 1 is the secret to keeping 'space-between' working inside a ScrollView
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  content: {
    gap: 16,
    marginBottom: 20, // Add some space between content and the button
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: "100%", // Changed from fixed 530 to 100% to avoid overflow on portrait mobile
    height: 100,
  },
});
