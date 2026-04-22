import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { toast } from "sonner-native";
import AuthButton from "../../components/ui/auth/AuthButton";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import OtpCodeInput from "../../components/ui/auth/OtpCodeInput";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";
import {
  useForgotOtpSendMutation,
  useUserForgotPasswordMutation,
} from "../../redux/api/userApi";

const FORGOT_EMAIL_STORAGE_KEY = "forgot_password_email";
const RESET_PASSWORD_TOKEN_KEY = "reset_password_token";

type GenericApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    message?: string;
    resetToken?: string;
  };
};

type ApiErrorShape = {
  data?: {
    message?: string;
  };
  error?: string;
};

export default function ForgotOtpScreen() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState("");
  const [forgotOtpSend, { isLoading: isVerifying }] =
    useForgotOtpSendMutation();
  const [userForgotPassword, { isLoading: isResending }] =
    useUserForgotPasswordMutation();

  const getErrorMessage = (error: unknown) => {
    const parsedError = error as ApiErrorShape;

    return (
      parsedError?.data?.message ||
      parsedError?.error ||
      "Something went wrong. Please try again."
    );
  };

  const getEmailFromLocalStorage = async () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.localStorage.getItem(FORGOT_EMAIL_STORAGE_KEY) || "";
    }

    return (await AsyncStorage.getItem(FORGOT_EMAIL_STORAGE_KEY)) || "";
  };

  const saveResetTokenSecurely = async (token: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.setItem(RESET_PASSWORD_TOKEN_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(RESET_PASSWORD_TOKEN_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  };

  useEffect(() => {
    const loadEmail = async () => {
      const savedEmail = (await getEmailFromLocalStorage())
        .trim()
        .toLowerCase();

      if (!savedEmail) {
        toast.warning("Please enter email first");
        router.replace(APP_ROUTES.forgotPassword);
        return;
      }

      setEmail(savedEmail);
    };

    loadEmail();
  }, [router]);

  const handleApplyCode = async () => {
    const normalizedOtp = otpValue.trim();

    if (!email) {
      toast.warning("Email not found. Please try again.");
      router.replace(APP_ROUTES.forgotPassword);
      return;
    }

    if (!normalizedOtp || normalizedOtp.length !== 4) {
      toast.warning("Please enter valid 4 digit OTP");
      return;
    }

    const payload = {
      email,
      otp: normalizedOtp,
    };

    try {
      const response = (await forgotOtpSend(
        payload,
      ).unwrap()) as GenericApiResponse;

      const resetToken = response?.data?.resetToken;
      if (resetToken) {
        await saveResetTokenSecurely(resetToken);
      }

      toast.success(
        response?.data?.message ||
          response?.message ||
          "OTP verified successfully",
      );
      router.push(APP_ROUTES.resetPassword);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSendEmailAgain = async () => {
    if (!email) {
      toast.warning("Email not found. Please try again.");
      router.replace(APP_ROUTES.forgotPassword);
      return;
    }

    try {
      const response = (await userForgotPassword({
        email,
      }).unwrap()) as GenericApiResponse;
      setOtpValue("");
      toast.success(response?.message || "OTP sent again successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
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
          title={isVerifying ? "Applying..." : "Apply Code"}
          onPress={handleApplyCode}
          disabled={isVerifying || isResending}
        />
        <AuthButton
          title={isResending ? "Sending..." : "Send Email Again"}
          variant="secondary"
          onPress={handleSendEmailAgain}
          disabled={isVerifying || isResending}
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
