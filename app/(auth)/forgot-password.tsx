import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

type ForgotPasswordResponse = {
  success?: boolean;
  message?: string;
};

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

    saveEmailToLocalStorage(value).catch(() => {
      // Ignore storage errors while typing; submit flow still validates and handles API errors.
    });
  };

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const payload = {
      email: normalizedEmail,
    };

    if (!payload.email) {
      toast.warning("Email is required");
      return;
    }

    try {
      const response = (await userForgotPassword(
        payload,
      ).unwrap()) as ForgotPasswordResponse;

      await saveEmailToLocalStorage(payload.email);
      toast.success(response?.message || "OTP sent successfully");
      router.push(APP_ROUTES.forgotOtp);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/splashscreen/SVG-01.png")}
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

            <Pressable
              className="btn-primary"
              onPress={handleSendOtp}
              disabled={isLoading}
              style={({ pressed }) => [
                {
                  opacity: pressed || isLoading ? 0.7 : 1,
                },
              ]}
            >
              <Text className="btn-text">
                {isLoading ? "Sending..." : "Send OTP"}
              </Text>
            </Pressable>
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
    gap: 16,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
     width: 530,
    height: 100,
  },
});
