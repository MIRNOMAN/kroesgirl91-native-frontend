import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import AuthButton from "../../components/ui/auth/AuthButton";
import AuthLabeledInput from "../../components/ui/auth/AuthLabeledInput";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";
import {
  useCreateUserRegisterMutation,
  type RegisterResponse,
} from "../../redux/api/userApi";

type RegisterErrorShape = {
  data?: {
    message?: string;
  };
  error?: string;
};

const REGISTER_EMAIL_STORAGE_KEY = "register_email";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserRegister, { isLoading }] = useCreateUserRegisterMutation();

  const getErrorMessage = (error: unknown) => {
    const parsedError = error as RegisterErrorShape;

    return (
      parsedError?.data?.message ||
      parsedError?.error ||
      "Registration failed. Please try again."
    );
  };

  const saveRegisterEmail = async (value: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.setItem(REGISTER_EMAIL_STORAGE_KEY, value);
      return;
    }

    await AsyncStorage.setItem(REGISTER_EMAIL_STORAGE_KEY, value);
  };

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFullName = fullName.trim().replace(/\s+/g, " ");
    const trimmedPassword = password.trim();

    if (!normalizedFullName || !normalizedEmail || !trimmedPassword) {
      toast.warning("Full name, email and password are required");
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isEmailValid) {
      toast.warning("Please enter a valid email");
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    const payload = {
      email: normalizedEmail,
      fullName: normalizedFullName,
      password: trimmedPassword,
    };

    try {
      const response = (await createUserRegister(
        payload,
      ).unwrap()) as RegisterResponse;

      console.log("[REGISTER][OTP_CODE]", response?.data?.otpResponse?.code);

      toast.success(
        response?.data?.message ||
          response?.message ||
          "Registration successful. Please verify OTP.",
      );

      await saveRegisterEmail(normalizedEmail);
      router.push(APP_ROUTES.verifyOtp);
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <View style={styles.content}>
              <AuthTitleBlock
                title="Create An Account"
                subtitle="Create your account to get into the unlimited options of payments & convenience."
              />

              <View style={styles.form}>
                <AuthLabeledInput
                  label="Full Name"
                  placeholder="Enter Full Name Here"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                <AuthLabeledInput
                  label="Email"
                  placeholder="Enter Email Here"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  autoCorrect={false}
                />
                <AuthLabeledInput
                  label="Password"
                  placeholder="Enter Password Here"
                  secureTextEntry
                  showPasswordToggle
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.bottomSection}>
              <Text style={styles.termsText}>
                By continuing, you confirm that you are 18 years or older and
                agree to our{" "}
                <Text
                  style={styles.linkInline}
                  accessibilityRole="link"
                  onPress={() => router.push(APP_ROUTES.termsConditions)}
                >
                  Terms & Conditions
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.linkInline}
                  accessibilityRole="link"
                  onPress={() => router.push(APP_ROUTES.privacyPolicy)}
                >
                  Privacy Policy.
                </Text>
              </Text>

              <AuthButton
                title={isLoading ? "Signing Up..." : "Sign Up"}
                onPress={handleRegister}
                disabled={isLoading}
              />

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <Pressable onPress={() => router.push(APP_ROUTES.login)}>
                  <Text style={styles.loginLink}> Log In</Text>
                </Pressable>
              </View>
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
    gap: 24,
  },
  form: {
    gap: 14,
  },
  bottomSection: {
    gap: 14,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  linkInline: {
    color: COLORS.authAccent,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    color: COLORS.authAccent,
    fontWeight: "700",
  },
});
