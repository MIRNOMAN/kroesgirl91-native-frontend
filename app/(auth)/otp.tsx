import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import AuthButton from "../../components/ui/auth/AuthButton";
import OtpCodeInput from "../../components/ui/auth/OtpCodeInput";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";
import { useRegisterOtpVerificationMutation } from "../../redux/api/userApi";

const REGISTER_EMAIL_STORAGE_KEY = "register_email";

type VerifyResponse = {
  success?: boolean;
  message?: string;
  data?: {
    message?: string;
  };
};

type VerifyErrorShape = {
  data?: {
    message?: string;
  };
  error?: string;
};

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ otp?: string }>();

  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [registerOtpVerification, { isLoading }] =
    useRegisterOtpVerificationMutation();

  useEffect(() => {
    const otpFromParams = typeof params.otp === "string" ? params.otp : "";
    if (otpFromParams) setOtpValue(otpFromParams);
  }, [params.otp]);

  useEffect(() => {
    const loadRegisterEmail = async () => {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        const savedEmail = window.localStorage.getItem(
          REGISTER_EMAIL_STORAGE_KEY,
        );
        setEmail(savedEmail?.trim().toLowerCase() || "");
        return;
      }

      const savedEmail = await AsyncStorage.getItem(REGISTER_EMAIL_STORAGE_KEY);
      setEmail(savedEmail?.trim().toLowerCase() || "");
    };

    loadRegisterEmail();
  }, []);

  const getErrorMessage = (error: unknown) => {
    const parsed = error as VerifyErrorShape;

    return (
      parsed?.data?.message ||
      parsed?.error ||
      "OTP verification failed. Please try again."
    );
  };

  const handleVerifyOtp = async () => {
    const normalizedOtp = otpValue.trim();

    if (!email) {
      toast.warning("Registration email missing. Please register again.");
      router.replace(APP_ROUTES.register);
      return;
    }

    if (!normalizedOtp || normalizedOtp.length !== 4) {
      toast.warning("Please enter valid 4 digit OTP");
      return;
    }

    try {
      const response = (await registerOtpVerification({
        otp: normalizedOtp,
        email,
      }).unwrap()) as VerifyResponse;

      toast.success(
        response?.data?.message ||
          response?.message ||
          "OTP verified successfully",
      );

      setIsVerified(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            {/* CONTENT */}
            {isVerified ? (
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
                  Your account has been registered successfully, now let&apos;s
                  enjoy Car features!
                </Text>
              </View>
            ) : (
              <View style={styles.content}>
                <Text style={styles.title}>Verify Your Account</Text>

                <Text style={styles.subtitle}>
                  Enter the 4 digit OTP code sent to your registered email.
                </Text>

                <OtpCodeInput
                  value={otpValue}
                  onChange={setOtpValue}
                  length={4}
                />
              </View>
            )}

            {/* BUTTON */}
            <View style={styles.buttonWrap}>
              <AuthButton
                title={
                  isVerified
                    ? "Go to Agreement"
                    : isLoading
                      ? "Verifying..."
                      : "Verify OTP"
                }
                onPress={
                  isVerified
                    ? () => router.replace(APP_ROUTES.aggrement)
                    : handleVerifyOtp
                }
                disabled={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.authBg,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.authBg,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },

  topLogoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  topLogo: {
    width: 530,
    height: 100,
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
    marginBottom: 20,
  },

  badgeImage: {
    width: 220,
    height: 220,
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

  buttonWrap: {
    marginTop: "auto",
  },
});
