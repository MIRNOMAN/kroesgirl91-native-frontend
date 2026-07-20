import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import {
  useResendOtpMutation,
  useUserRegisterEmailVerificationMutation,
  useUserRegisterPhoneVerificationMutation,
} from "../../redux/api/userApi";

const REGISTER_EMAIL_STORAGE_KEY = "register_email";
const REGISTER_PHONE_STORAGE_KEY = "register_phone";
const COOLDOWN_SECONDS = 60;

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
  const params = useLocalSearchParams<{
    otp?: string;
    email?: string;
    phone?: string;
    otpMethod?: string;
  }>();
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpMethod, setOtpMethod] = useState<"email" | "phone">("email");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyEmailOtp, { isLoading: isVerifyingEmail }] =
    useUserRegisterEmailVerificationMutation();
  const [verifyPhoneOtp, { isLoading: isVerifyingPhone }] =
    useUserRegisterPhoneVerificationMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [resendTarget, setResendTarget] = useState<"email" | "sms">("email");
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCooldown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const otpFromParams = typeof params.otp === "string" ? params.otp : "";
    if (otpFromParams) {
      setOtpValue(otpFromParams);
    }
  }, [params.otp]);

  useEffect(() => {
    const loadData = async () => {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        const savedEmail = window.localStorage.getItem(
          REGISTER_EMAIL_STORAGE_KEY,
        );
        const savedPhone = window.localStorage.getItem(
          REGISTER_PHONE_STORAGE_KEY,
        );
        setEmail(params.email || savedEmail?.trim().toLowerCase() || "");
        setPhone(params.phone || savedPhone?.trim() || "");
        return;
      }

      const savedEmail = await AsyncStorage.getItem(REGISTER_EMAIL_STORAGE_KEY);
      const savedPhone = await AsyncStorage.getItem(REGISTER_PHONE_STORAGE_KEY);
      setEmail(params.email || savedEmail?.trim().toLowerCase() || "");
      setPhone(params.phone || savedPhone?.trim() || "");
    };

    loadData();
  }, [params.email, params.phone]);

  useEffect(() => {
    if (params.otpMethod === "phone") {
      setOtpMethod("phone");
    } else {
      setOtpMethod("email");
    }
  }, [params.otpMethod]);

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

    if (otpMethod === "email" && !email) {
      toast.warning("Registration email missing. Please register again.");
      router.replace(APP_ROUTES.register);
      return;
    }

    if (otpMethod === "phone" && !phone) {
      toast.warning("Registration phone missing. Please register again.");
      router.replace(APP_ROUTES.register);
      return;
    }

    if (!normalizedOtp || normalizedOtp.length !== 4) {
      toast.warning("Please enter valid 4 digit OTP");
      return;
    }

    try {
      const response =
        otpMethod === "email"
          ? await verifyEmailOtp({ otp: normalizedOtp, email }).unwrap()
          : await verifyPhoneOtp({ otp: normalizedOtp, phone }).unwrap();

      toast.success(
        (response as any)?.data?.message ||
          (response as any)?.message ||
          "OTP verified successfully",
      );
      setIsVerified(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResendOtp = async (target: "email" | "sms") => {
    if (cooldown > 0) return;

    try {
      setResendTarget(target);
      const payload = target === "email" ? { email } : { phone };

      const response = await resendOtp(payload).unwrap();

      toast.success(
        (response as any)?.message ||
          `OTP resent to your ${target === "email" ? "email" : "phone"}`,
      );
      startCooldown();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSwitchMethod = (method: "email" | "phone") => {
    if (method === otpMethod) return;
    setOtpMethod(method);
    setOtpValue("");
  };

  const maskedValue =
    otpMethod === "email"
      ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
      : phone.replace(/(.{3})(.*)(.{2})/, "$1***$3");

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
                  Enter the 4 digit OTP code sent to your{" "}
                  {otpMethod === "email" ? "email" : "phone"}
                </Text>

                <View style={styles.methodSwitcher}>
                  <Pressable
                    onPress={() => handleSwitchMethod("email")}
                    style={[
                      styles.methodButton,
                      otpMethod === "email" && styles.methodButtonActive,
                    ]}>
                    <Ionicons
                      name="mail-outline"
                      size={16}
                      color={
                        otpMethod === "email" ? "#FFFFFF" : COLORS.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.methodButtonText,
                        otpMethod === "email" && styles.methodButtonTextActive,
                      ]}>
                      Email
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleSwitchMethod("phone")}
                    style={[
                      styles.methodButton,
                      otpMethod === "phone" && styles.methodButtonActive,
                    ]}>
                    <Ionicons
                      name="call-outline"
                      size={16}
                      color={
                        otpMethod === "phone" ? "#FFFFFF" : COLORS.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.methodButtonText,
                        otpMethod === "phone" && styles.methodButtonTextActive,
                      ]}>
                      Phone
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.maskedValue}>{maskedValue}</Text>

                <OtpCodeInput
                  value={otpValue}
                  onChange={setOtpValue}
                  length={4}
                />

                <View style={styles.resendSection}>
                  <Text style={styles.didNotReceive}>
                    Didn&apos;t receive the OTP?
                  </Text>

                  {cooldown > 0 ? (
                    <Text style={styles.cooldownText}>
                      Resend in {cooldown}s
                    </Text>
                  ) : (
                    <View style={styles.resendOptions}>
                      <Pressable
                        onPress={() => handleResendOtp("email")}
                        disabled={isResending}
                        style={styles.resendOption}>
                        {isResending && resendTarget === "email" ? (
                          <Ionicons
                            name="reload"
                            size={16}
                            color="#F59E0B"
                          />
                        ) : (
                          <Ionicons
                            name="mail-outline"
                            size={16}
                            color="#F59E0B"
                          />
                        )}
                        <Text style={styles.resendOptionText}>
                          Resend via Email
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleResendOtp("sms")}
                        disabled={isResending}
                        style={styles.resendOption}>
                        {isResending && resendTarget === "sms" ? (
                          <Ionicons
                            name="reload"
                            size={16}
                            color="#F59E0B"
                          />
                        ) : (
                          <Ionicons
                            name="chatbubble-outline"
                            size={16}
                            color="#F59E0B"
                          />
                        )}
                        <Text style={styles.resendOptionText}>
                          Resend via SMS
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            )}

            <AuthButton
              title={
                isVerified
                  ? "Go to Agreement"
                  : isVerifyingEmail || isVerifyingPhone
                    ? "Verifying..."
                    : "Verify OTP"
              }
              onPress={
                isVerified
                  ? () => router.replace(APP_ROUTES.aggrement)
                  : handleVerifyOtp
              }
              disabled={isVerifyingEmail || isVerifyingPhone}
            />
          </View>
        </ScrollView>
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
    marginBottom: 20,
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
  methodSwitcher: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.authBorder,
    backgroundColor: COLORS.authInput,
  },
  methodButtonActive: {
    backgroundColor: COLORS.onboardingPrimary,
    borderColor: COLORS.onboardingPrimary,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  methodButtonTextActive: {
    color: "#FFFFFF",
  },
  maskedValue: {
    fontSize: 14,
    color: COLORS.authPlaceholder,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  resendSection: {
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  didNotReceive: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  resendOptions: {
    flexDirection: "row",
    gap: 20,
  },
  resendOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resendOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F59E0B",
  },
  cooldownText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
});
