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

import AuthButton from "../../components/ui/auth/AuthButton";
import AuthLabeledInput from "../../components/ui/auth/AuthLabeledInput";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

import {
  useCreateUserRegisterMutation,
  type RegisterResponse,
} from "../../redux/api/userApi";

const REGISTER_EMAIL_STORAGE_KEY = "register_email";

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [createUserRegister, { isLoading }] = useCreateUserRegisterMutation();

  // ✅ safer error handler
  const getErrorMessage = (error: any): string => {
    return (
      error?.data?.message ||
      error?.error ||
      "Registration failed. Please try again."
    );
  };

  // ✅ save email (web + mobile)
  const saveRegisterEmail = async (value: string) => {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.localStorage.setItem(REGISTER_EMAIL_STORAGE_KEY, value);
      } else {
        await AsyncStorage.setItem(REGISTER_EMAIL_STORAGE_KEY, value);
      }
    } catch {
      console.log("Failed to save email");
    }
  };

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFullName = fullName.trim().replace(/\s+/g, " ");
    const trimmedPassword = password.trim();
    const trimmedPhone = phone.trim();

    // ✅ required validation
    if (!normalizedFullName || !normalizedEmail || !trimmedPassword) {
      toast.warning("Full name, email and password are required");
      return;
    }

    // ✅ email validation
    // const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    //   normalizedEmail
    // );
    // if (!isEmailValid) {
    //   toast.warning("Please enter a valid email");
    //   return;
    // }

    // ✅ password validation
    if (trimmedPassword.length < 8) {
      toast.warning("Password must be at least 8 characters");
      return;
    }

    // ✅ optional phone validation (BD format simple)
    if (trimmedPhone && !/^(\+8801|01)[3-9]\d{8}$/.test(trimmedPhone)) {
      toast.warning("Enter a valid phone number");
      return;
    }

    const payload = {
      email: normalizedEmail,
      fullName: normalizedFullName,
      password: trimmedPassword,
      phone: trimmedPhone || undefined,
    };

    try {
      const response = (await createUserRegister(
        payload,
      ).unwrap()) as RegisterResponse;

      console.log("[REGISTER][OTP_CODE]", response?.data?.otpResponse?.code);

      toast.success(
        response?.data?.message ||
          response?.message ||
          "Registration successful. Verify OTP.",
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                title="Create An Account"
                subtitle="Create your account to access unlimited payment options."
              />

              <View style={styles.form}>
                <AuthLabeledInput
                  label="Full Name"
                  placeholder="Enter Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />

                <AuthLabeledInput
                  label="Email"
                  placeholder="Enter Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <AuthLabeledInput
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />

                <AuthLabeledInput
                  label="Password"
                  placeholder="Enter Password"
                  secureTextEntry
                  showPasswordToggle
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <View style={styles.bottomSection}>
              <Text style={styles.termsText}>
                By continuing, you confirm that you are 18+ and agree to our{" "}
                <Text
                  style={styles.linkInline}
                  onPress={() => router.push(APP_ROUTES.termsConditions)}
                >
                  Terms & Conditions
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.linkInline}
                  onPress={() => router.push(APP_ROUTES.privacyPolicy)}
                >
                  Privacy Policy
                </Text>
                .
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
  logoContainer: {
    alignItems: "center",
  },
  logo: {
   width: 530,
    height: 100,
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
