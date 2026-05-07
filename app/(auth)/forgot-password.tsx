import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
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

const FORGOT_EMAIL_STORAGE_KEY = "forgot_password_email";

type ForgotPasswordErrorShape = {
  data?: {
    message?: string;
  };
  error?: string;
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userForgotPassword, { isLoading }] = useUserForgotPasswordMutation();

  const getErrorMessage = (error: unknown) => {
    const parsedError = error as ForgotPasswordErrorShape;
    return (
      parsedError?.data?.message ||
      parsedError?.error ||
      "Failed to send OTP. Please try again."
    );
  };

  const saveEmailToLocalStorage = async (value: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.setItem(FORGOT_EMAIL_STORAGE_KEY, value);
      return;
    }
    await AsyncStorage.setItem(FORGOT_EMAIL_STORAGE_KEY, value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    saveEmailToLocalStorage(value).catch(() => {});
  };

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.warning("Email is required");
      return;
    }

    try {
      const response = await userForgotPassword({
        email: normalizedEmail,
      }).unwrap();

      await saveEmailToLocalStorage(normalizedEmail);
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
          {/* ScrollView replaces the main View wrapper */}
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/login/login_icons.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <AuthTitleBlock
                title="Forget Password"
                subtitle="Enter your email here. Give valid email to reset your password"
                titleSize={31}
                subtitleSize={16}
                subtitleMaxWidth={260}
              />

              <AuthLabeledInput
                label="Email"
                placeholder="Enter Email Here"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={handleEmailChange}
                autoCorrect={false}
                compact
              />
            </View>

            {/* This remains at the bottom due to justifyContent: 'space-between' */}
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
