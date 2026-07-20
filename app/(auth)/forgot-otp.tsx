import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

const FORGOT_IDENTIFIER_STORAGE_KEY = "forgot_password_identifier";
const FORGOT_METHOD_STORAGE_KEY = "forgot_password_method";
const RESET_PASSWORD_TOKEN_KEY = "reset_password_token";

export default function ForgotOtpScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  const [otpValue, setOtpValue] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [method, setMethod] = useState<"email" | "phone">("email");

  const [forgotOtpSend, { isLoading: isVerifying }] =
    useForgotOtpSendMutation();

  const [userForgotPassword, { isLoading: isResending }] =
    useUserForgotPasswordMutation();

  const getErrorMessage = (error: unknown) => {
    const parsed = error as any;

    return (
      parsed?.data?.message ||
      parsed?.error ||
      "Something went wrong. Please try again."
    );
  };

  const getIdentifierFromLocalStorage = async () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const id = window.localStorage.getItem(FORGOT_IDENTIFIER_STORAGE_KEY) || "";
      const m = (window.localStorage.getItem(FORGOT_METHOD_STORAGE_KEY) as "email" | "phone") || "email";
      return { identifier: id, method: m };
    }

    const id = (await AsyncStorage.getItem(FORGOT_IDENTIFIER_STORAGE_KEY)) || "";
    const m = ((await AsyncStorage.getItem(FORGOT_METHOD_STORAGE_KEY)) as "email" | "phone") || "email";
    return { identifier: id, method: m };
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
    const loadData = async () => {
      const { identifier: savedId, method: savedMethod } = await getIdentifierFromLocalStorage();

      if (!savedId) {
        toast.warning("Please enter your email or phone first");
        router.replace(APP_ROUTES.forgotPassword);
        return;
      }

      setIdentifier(savedId);
      setMethod(savedMethod);
    };

    loadData();
  }, [router]);

  const buildPayload = () => {
    return method === "email"
      ? { email: identifier }
      : { phone: identifier };
  };

  const handleApplyCode = async () => {
    const normalizedOtp = otpValue.trim();

    if (!identifier) {
      toast.warning("Identifier not found. Please try again.");
      router.replace(APP_ROUTES.forgotPassword);
      return;
    }

    if (!normalizedOtp || normalizedOtp.length !== 4) {
      toast.warning("Please enter valid 4 digit OTP");
      return;
    }

    try {
      const response = await forgotOtpSend({
        ...buildPayload(),
        otp: normalizedOtp,
      }).unwrap();

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

  const handleSendAgain = async () => {
    if (!identifier) {
      toast.warning("Identifier not found. Please try again.");
      router.replace(APP_ROUTES.forgotPassword);
      return;
    }

    try {
      const response = await userForgotPassword(buildPayload()).unwrap();

      setOtpValue("");
      toast.success(response?.message || "OTP sent again successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.authBg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* CONTENT */}
            <View style={styles.content}>
              <AuthTitleBlock
                title="Apply Reset Code"
                subtitle="Please check your email or phone. Give correct reset 4 digit code here."
                titleSize={31}
                subtitleSize={11}
                subtitleMaxWidth={240}
              />

              <OtpCodeInput
                value={otpValue}
                onChange={setOtpValue}
                length={4}
              />
            </View>

            {/* ACTIONS */}
            <View style={styles.actions}>
              <AuthButton
                title={isVerifying ? "Applying..." : "Apply Code"}
                onPress={handleApplyCode}
                disabled={isVerifying || isResending}
              />

              <AuthButton
                title={isResending ? "Sending..." : "Send Again"}
                variant="secondary"
                onPress={handleSendAgain}
                disabled={isVerifying || isResending}
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

  container: {
    flex: 1,
    backgroundColor: COLORS.authBg,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },

  logoContainer: {
    alignItems: "center",
  },

  logo: {
    // width: 'ait',
    height: 100,
  },

  actions: {
    // marginTop: "auto",
  },
});
