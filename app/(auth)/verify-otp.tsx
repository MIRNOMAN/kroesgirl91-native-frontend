import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
    if (otpFromParams) {
      setOtpValue(otpFromParams);
    }
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
    const parsedError = error as VerifyErrorShape;

    return (
      parsedError?.data?.message ||
      parsedError?.error ||
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.authBg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
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

          <AuthButton
            title={
              isVerified
                ? "Go to Home"
                : isLoading
                  ? "Verifying..."
                  : "Verify OTP"
            }
            onPress={
              isVerified
                ? () => router.replace(APP_ROUTES.home)
                : handleVerifyOtp
            }
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
