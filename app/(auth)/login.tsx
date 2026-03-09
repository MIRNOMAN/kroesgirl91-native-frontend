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
import AuthLabeledInput from "../../components/ui/auth/AuthLabeledInput";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import {
  useCreateUserLoginMutation,
  type LoginResponse,
} from "../../redux/api/userApi";

type LoginErrorShape = {
  data?: {
    message?: string;
  };
  error?: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState(__DEV__ ? "pro101@gmail.com" : "");
  const [password, setPassword] = useState(__DEV__ ? "111111" : "");
  const [createUserLogin, { isLoading }] = useCreateUserLoginMutation();

  const getErrorMessage = (error: unknown) => {
    const parsedError = error as LoginErrorShape;

    return (
      parsedError?.data?.message ||
      parsedError?.error ||
      "Login failed. Please try again."
    );
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    console.log("[LOGIN][REQUEST]", {
      emailInput: email,
      normalizedEmail,
      passwordLength: trimmedPassword.length,
    });

    if (!normalizedEmail || !trimmedPassword) {
      console.log("[LOGIN][VALIDATION_FAILED] Missing email or password");
      toast.warning("Email and password are required");
      return;
    }

    try {
      const response = (await createUserLogin({
        email: normalizedEmail,
        password: trimmedPassword,
      }).unwrap()) as LoginResponse;

      console.log("[LOGIN][RESPONSE]", {
        success: response?.success,
        statusCode: response?.statusCode,
        message: response?.message,
        hasAccessToken: Boolean(response?.data?.accessToken),
        userEmail: response?.data?.user?.email,
      });

      if (!response?.success || !response?.data?.accessToken) {
        console.log("[LOGIN][INVALID_RESPONSE]", response);
        toast.error("Login failed. Invalid server response.");
        return;
      }

      signIn({
        role: response.data.user.role,
        accessToken: response.data.accessToken,
      });

      toast.success(response.data.message || response.message);
      router.replace(APP_ROUTES.home);
    } catch (error) {
      console.error("[LOGIN][ERROR_RAW]", error);
      console.log("[LOGIN][ERROR_PARSED]", getErrorMessage(error));
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
            {/* ================= TOP CONTENT ================= */}
            <View style={styles.content}>
              <AuthTitleBlock
                title="Sign In Account"
                subtitle="Start your journey in playmate with fun, interactive lessons now"
                titleSize={31}
                subtitleSize={15}
                subtitleMaxWidth={300}
              />

              <View style={styles.form}>
                <AuthLabeledInput
                  label="Email"
                  placeholder="Enter Email Here"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  autoCorrect={false}
                  compact
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
                  compact
                />

                <View style={styles.forgotContainer}>
                  <Pressable
                    onPress={() => router.push(APP_ROUTES.forgotPassword)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Text style={styles.forgotTextcss}>Forgot Password</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* ================= BOTTOM SECTION ================= */}
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

              <Pressable
                className="btn-primary"
                onPress={handleLogin}
                disabled={isLoading}
                style={({ pressed }) => [
                  {
                    opacity: pressed || isLoading ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="btn-text">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </Pressable>

              <View style={styles.signupRow}>
                <Text style={styles.signupText}>
                  Don&apos;t have an account?
                </Text>

                <Pressable
                  onPress={() => router.push(APP_ROUTES.register)}
                  style={({ pressed }) => [
                    styles.forgotWrap,
                    {
                      opacity: pressed ? 0.6 : 1,
                      backgroundColor: pressed
                        ? COLORS.onboardingPrimary
                        : "rgba(0,0,0,0.05)", // default bg
                    },
                  ]}
                >
                  <Text style={styles.forgotText}> Sign Up</Text>
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
    paddingTop: 45,
    paddingBottom: 44,
    justifyContent: "space-between",
  },
  content: {
    gap: 16,
  },
  form: {
    marginTop: 20,
    gap: 20,
  },
  forgotWrap: {
    alignSelf: "flex-end",
  },
  forgotText: {
    fontSize: 14,
    color: COLORS.authAccent,
    fontWeight: "500",
  },
  forgotTextcss: {
    fontSize: 14,

    fontWeight: "500",
  },

  /* ===== Bottom Section ===== */
  bottomSection: {
    gap: 16,
  },
  forgotContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  termsText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  linkInline: {
    color: COLORS.authAccent,
    fontWeight: "600",
  },

  /* ===== Signup Row ===== */
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  signupText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  signupLinkContainer: {
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  signupLink: {
    fontSize: 13,
    color: COLORS.authAccent,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
