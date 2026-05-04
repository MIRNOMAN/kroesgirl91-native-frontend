import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { toast } from "sonner-native";
import AuthButton from "../../components/ui/auth/AuthButton";
import AuthLabeledInput from "../../components/ui/auth/AuthLabeledInput";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";
import { useUserResetPasswordMutation } from "../../redux/api/userApi";

const RESET_PASSWORD_TOKEN_KEY = "reset_password_token";

type ResetPasswordResponse = {
  success?: boolean;
  message?: string;
  data?: {
    message?: string;
  };
};

type ResetPasswordErrorShape = {
  data?: {
    message?: string;
  };
  error?: string;
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [userResetPassword, { isLoading }] = useUserResetPasswordMutation();

  const getErrorMessage = (error: unknown) => {
    const parsedError = error as ResetPasswordErrorShape;

    return (
      parsedError?.data?.message ||
      parsedError?.error ||
      "Failed to reset password. Please try again."
    );
  };

  const getResetTokenFromStorage = async () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.localStorage.getItem(RESET_PASSWORD_TOKEN_KEY) || "";
    }

    const secureToken = await SecureStore.getItemAsync(
      RESET_PASSWORD_TOKEN_KEY,
    );

    // Fallback for older app states where token may have been saved in AsyncStorage.
    if (secureToken) {
      return secureToken;
    }

    return (await AsyncStorage.getItem(RESET_PASSWORD_TOKEN_KEY)) || "";
  };

  const clearResetTokenFromStorage = async () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.removeItem(RESET_PASSWORD_TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(RESET_PASSWORD_TOKEN_KEY);
    await AsyncStorage.removeItem(RESET_PASSWORD_TOKEN_KEY);
  };

  useEffect(() => {
    const loadResetToken = async () => {
      const savedToken = (await getResetTokenFromStorage()).trim();

      if (!savedToken) {
        toast.warning("Reset session expired. Please verify OTP again.");
        router.replace(APP_ROUTES.forgotOtp);
        return;
      }

      setResetToken(savedToken);
    };

    loadResetToken();
  }, [router]);

  const handleResetPassword = async () => {
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedNewPassword || !trimmedConfirmPassword) {
      toast.warning("Both password fields are required");
      return;
    }

    if (trimmedNewPassword !== trimmedConfirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    if (!resetToken) {
      toast.warning("Reset token missing. Please verify OTP again.");
      router.replace(APP_ROUTES.forgotOtp);
      return;
    }

    const payload = {
      newPassword: trimmedNewPassword,
      resetToken,
    };

    try {
      const response = (await userResetPassword(
        payload,
      ).unwrap()) as ResetPasswordResponse;

      await clearResetTokenFromStorage();
      toast.success(response?.message || "Password reset successful");
      router.replace({
        pathname: "/reset-success",
        params: {
          message:
            response?.data?.message ||
            response?.message ||
            "Password updated successfully.",
        },
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
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
          title="Reset Password"
          subtitle="Add your new password"
          titleSize={31}
          subtitleSize={16}
          subtitleMaxWidth={180}
        />

        <View style={styles.form}>
          <AuthLabeledInput
            label="New Password"
            placeholder="Enter New Password Here"
            secureTextEntry
            showPasswordToggle
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
            compact
          />
          <AuthLabeledInput
            label="Confirm Password"
            placeholder="Enter Password Here"
            secureTextEntry
            showPasswordToggle
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            compact
          />
        </View>
      </View>

      <AuthButton
        title={isLoading ? "Resetting..." : "Reset Password"}
        onPress={handleResetPassword}
        disabled={isLoading}
      />
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
    gap: 36,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 530,
    height: 100,
  },
  form: {
    gap: 20,
  },
});
