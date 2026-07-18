import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
import MapPicker, { type MapPickerResult } from "../../components/ui/MapPicker";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

import {
  useCreateUserRegisterMutation,
  type RegisterResponse,
} from "../../redux/api/userApi";

const REGISTER_EMAIL_STORAGE_KEY = "register_email";
const REGISTER_PHONE_STORAGE_KEY = "register_phone";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  password: string;
  role: "USER" | "MERCHANT";
  businessName: string;
  businessAddressLine1: string;
  businessLatitude1: string;
  businessLongitude1: string;
  businessAddressLine2: string;
  businessLatitude2: string;
  businessLongitude2: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  const [createUserRegister, { isLoading }] = useCreateUserRegisterMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      latitude: "",
      longitude: "",
      password: "",
      role: "USER",
      businessName: "",
      businessAddressLine1: "",
      businessLatitude1: "",
      businessLongitude1: "",
      businessAddressLine2: "",
      businessLatitude2: "",
      businessLongitude2: "",
    },
  });

  const selectedRole = watch("role");
  const [mapPickerVisible, setMapPickerVisible] = useState(false);
  const [activeMapField, setActiveMapField] = useState<
    "userAddress" | "businessAddress1" | "businessAddress2"
  >("userAddress");
  const [userCoords, setUserCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [biz1Coords, setBiz1Coords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [biz2Coords, setBiz2Coords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const openMapPicker = (
    field: "userAddress" | "businessAddress1" | "businessAddress2",
  ) => {
    setActiveMapField(field);
    setMapPickerVisible(true);
  };

  const handleMapConfirm = (result: MapPickerResult) => {
    const opts = { shouldValidate: true, shouldDirty: true };

    if (activeMapField === "userAddress") {
      setValue("address", result.address, opts);
      setValue("latitude", String(result.latitude), opts);
      setValue("longitude", String(result.longitude), opts);
      setUserCoords({
        latitude: result.latitude,
        longitude: result.longitude,
      });
    } else if (activeMapField === "businessAddress1") {
      setValue("businessAddressLine1", result.address, opts);
      setValue("businessLatitude1", String(result.latitude), opts);
      setValue("businessLongitude1", String(result.longitude), opts);
      setBiz1Coords({
        latitude: result.latitude,
        longitude: result.longitude,
      });
    } else if (activeMapField === "businessAddress2") {
      setValue("businessAddressLine2", result.address, opts);
      setValue("businessLatitude2", String(result.latitude), opts);
      setValue("businessLongitude2", String(result.longitude), opts);
      setBiz2Coords({
        latitude: result.latitude,
        longitude: result.longitude,
      });
    }
  };

  const getMapPickerInitial = () => {
    if (activeMapField === "userAddress" && userCoords)
      return { lat: userCoords.latitude, lng: userCoords.longitude };
    if (activeMapField === "businessAddress1" && biz1Coords)
      return { lat: biz1Coords.latitude, lng: biz1Coords.longitude };
    if (activeMapField === "businessAddress2" && biz2Coords)
      return { lat: biz2Coords.latitude, lng: biz2Coords.longitude };
    return { lat: 5.852, lng: -55.203 };
  };

  const getMapPickerTitle = () => {
    if (activeMapField === "userAddress") return "Pick Your Address";
    if (activeMapField === "businessAddress1") return "Pick Business Address";
    return "Pick Second Business Address";
  };

  const getErrorMessage = (error: any): string => {
    return (
      error?.data?.message ||
      error?.error ||
      "Registration failed. Please try again."
    );
  };

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

  const saveRegisterPhone = async (value: string) => {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.localStorage.setItem(REGISTER_PHONE_STORAGE_KEY, value);
      } else {
        await AsyncStorage.setItem(REGISTER_PHONE_STORAGE_KEY, value);
      }
    } catch {
      console.log("Failed to save phone");
    }
  };

  const onSubmit = async (data: FormValues) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const normalizedFullName = data.fullName.trim().replace(/\s+/g, " ");
    const trimmedPassword = data.password.trim();
    const trimmedPhone = data.phone.trim();

    const payload: any = {
      email: normalizedEmail,
      fullName: normalizedFullName,
      password: trimmedPassword,
      phone: trimmedPhone,
      role: data.role,
    };

    if (data.address.trim()) payload.address = data.address.trim();
    if (data.latitude.trim())
      payload.latitude = parseFloat(data.latitude.trim());
    if (data.longitude.trim())
      payload.longitude = parseFloat(data.longitude.trim());

    if (data.role === "MERCHANT") {
      payload.businessName = data.businessName.trim();
      payload.businessAddressLine1 = data.businessAddressLine1.trim();
      if (data.businessLatitude1.trim())
        payload.businessLatitude1 = parseFloat(data.businessLatitude1.trim());
      if (data.businessLongitude1.trim())
        payload.businessLongitude1 = parseFloat(data.businessLongitude1.trim());
      if (data.businessAddressLine2.trim())
        payload.businessAddressLine2 = data.businessAddressLine2.trim();
      if (data.businessLatitude2.trim())
        payload.businessLatitude2 = parseFloat(data.businessLatitude2.trim());
      if (data.businessLongitude2.trim())
        payload.businessLongitude2 = parseFloat(data.businessLongitude2.trim());
    }

    try {
      const response = (await createUserRegister(
        payload,
      ).unwrap()) as RegisterResponse;

      console.log({ payload });
      console.log("[REGISTER][OTP_CODE]", response?.data?.otpResponse?.code);

      toast.success(
        response?.data?.message ||
          response?.message ||
          "Registration successful. Verify OTP.",
      );

      await saveRegisterEmail(normalizedEmail);
      await saveRegisterPhone(trimmedPhone);
      router.push({
        pathname: APP_ROUTES.verifyOtp,
        params: {
          email: normalizedEmail,
          phone: trimmedPhone,
        },
      });
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.content}>
                <AuthTitleBlock
                  title="Create An Account"
                  subtitle="Create your account to access unlimited payment options."
                />

                <Controller
                  control={control}
                  name="role"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.roleSelector}>
                      <Pressable
                        onPress={() => onChange("USER")}
                        style={[
                          styles.roleButton,
                          value === "USER" && styles.roleButtonActive,
                        ]}>
                        <Ionicons
                          name="person-outline"
                          size={18}
                          color={
                            value === "USER" ? "#FFFFFF" : COLORS.textSecondary
                          }
                        />
                        <Text
                          style={[
                            styles.roleButtonText,
                            value === "USER" && styles.roleButtonTextActive,
                          ]}>
                          User
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => onChange("MERCHANT")}
                        style={[
                          styles.roleButton,
                          value === "MERCHANT" && styles.roleButtonActive,
                        ]}>
                        <Ionicons
                          name="storefront-outline"
                          size={18}
                          color={
                            value === "MERCHANT"
                              ? "#FFFFFF"
                              : COLORS.textSecondary
                          }
                        />
                        <Text
                          style={[
                            styles.roleButtonText,
                            value === "MERCHANT" && styles.roleButtonTextActive,
                          ]}>
                          Merchant
                        </Text>
                      </Pressable>
                    </View>
                  )}
                />

                <View style={styles.form}>
                  <Controller
                    control={control}
                    name="fullName"
                    rules={{
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Full name must be at least 2 characters",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View>
                        <AuthLabeledInput
                          label="Full Name *"
                          placeholder="Enter Full Name"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                        />
                        {errors.fullName && (
                          <Text style={styles.errorText}>
                            {errors.fullName.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View>
                        <AuthLabeledInput
                          label="Email *"
                          placeholder="Enter Email"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                        {errors.email && (
                          <Text style={styles.errorText}>
                            {errors.email.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="phone"
                    rules={{
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+?[\d\s\-()]{7,15}$/,
                        message: "Enter a valid international phone number",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View>
                        <AuthLabeledInput
                          label="Phone Number *"
                          placeholder="Enter Phone Number"
                          keyboardType="phone-pad"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                        {errors.phone && (
                          <Text style={styles.errorText}>
                            {errors.phone.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="address"
                    render={({ field: { value } }) => (
                      <View>
                        <Text style={styles.fieldLabel}>
                          Address (Optional)
                        </Text>
                        <Pressable
                          style={styles.mapPickerButton}
                          onPress={() => openMapPicker("userAddress")}>
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color={
                              value
                                ? COLORS.onboardingPrimary
                                : COLORS.authPlaceholder
                            }
                          />
                          <Text
                            style={[
                              styles.mapPickerText,
                              value && styles.mapPickerTextFilled,
                            ]}
                            numberOfLines={1}>
                            {value || "Tap to pick location on map"}
                          </Text>
                          <Ionicons
                            name="chevron-forward"
                            size={16}
                            color={COLORS.authPlaceholder}
                          />
                        </Pressable>
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View>
                        <AuthLabeledInput
                          label="Password *"
                          placeholder="Enter Password"
                          secureTextEntry
                          showPasswordToggle
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                        {errors.password && (
                          <Text style={styles.errorText}>
                            {errors.password.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>

                {selectedRole === "MERCHANT" && (
                  <View style={styles.merchantSection}>
                    <View style={styles.merchantSectionHeader}>
                      <View style={styles.merchantSectionDot} />
                      <Text style={styles.merchantSectionTitle}>
                        Business Details
                      </Text>
                    </View>

                    <View style={styles.merchantForm}>
                      <Controller
                        control={control}
                        name="businessName"
                        rules={{
                          required:
                            selectedRole === "MERCHANT"
                              ? "Business name is required"
                              : false,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <View>
                            <AuthLabeledInput
                              label="Business Name *"
                              placeholder="Enter Business Name"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              autoCapitalize="words"
                            />
                            {errors.businessName && (
                              <Text style={styles.errorText}>
                                {errors.businessName.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />

                      <Controller
                        control={control}
                        name="businessAddressLine1"
                        rules={{
                          required:
                            selectedRole === "MERCHANT"
                              ? "Business address is required"
                              : false,
                        }}
                        render={({ field: { value } }) => (
                          <View>
                            <Text style={styles.fieldLabel}>
                              Business Address Line 1 *
                            </Text>
                            <Pressable
                              style={styles.mapPickerButton}
                              onPress={() => openMapPicker("businessAddress1")}>
                              <Ionicons
                                name="location-outline"
                                size={18}
                                color={
                                  value
                                    ? COLORS.onboardingPrimary
                                    : COLORS.authPlaceholder
                                }
                              />
                              <Text
                                style={[
                                  styles.mapPickerText,
                                  value && styles.mapPickerTextFilled,
                                ]}
                                numberOfLines={1}>
                                {value || "Tap to pick business location"}
                              </Text>
                              <Ionicons
                                name="chevron-forward"
                                size={16}
                                color={COLORS.authPlaceholder}
                              />
                            </Pressable>
                            {errors.businessAddressLine1 && (
                              <Text style={styles.errorText}>
                                {errors.businessAddressLine1.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />

                      <Controller
                        control={control}
                        name="businessAddressLine2"
                        render={({ field: { value } }) => (
                          <View>
                            <Text style={styles.fieldLabel}>
                              Business Address Line 2 (Optional)
                            </Text>
                            <Pressable
                              style={styles.mapPickerButton}
                              onPress={() => openMapPicker("businessAddress2")}>
                              <Ionicons
                                name="location-outline"
                                size={18}
                                color={
                                  value
                                    ? COLORS.onboardingPrimary
                                    : COLORS.authPlaceholder
                                }
                              />
                              <Text
                                style={[
                                  styles.mapPickerText,
                                  value && styles.mapPickerTextFilled,
                                ]}
                                numberOfLines={1}>
                                {value || "Tap to pick second address"}
                              </Text>
                              <Ionicons
                                name="chevron-forward"
                                size={16}
                                color={COLORS.authPlaceholder}
                              />
                            </Pressable>
                          </View>
                        )}
                      />

                    </View>
                  </View>
                )}
              </View>

              <View style={styles.bottomSection}>
                <Text style={styles.termsText}>
                  By continuing, you confirm that you are 18+ and agree to our{" "}
                  <Text
                    style={styles.linkInline}
                    onPress={() => router.push(APP_ROUTES.termsConditions)}>
                    Terms & Conditions
                  </Text>{" "}
                  and{" "}
                  <Text
                    style={styles.linkInline}
                    onPress={() => router.push(APP_ROUTES.privacyPolicy)}>
                    Privacy Policy
                  </Text>
                  .
                </Text>

                <AuthButton
                  title={
                    isLoading
                      ? "Signing Up..."
                      : selectedRole === "MERCHANT"
                        ? "Sign Up as Merchant"
                        : "Sign Up"
                  }
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading || !isValid}
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
        </ScrollView>
      </KeyboardAvoidingView>

      <MapPicker
        visible={mapPickerVisible}
        onClose={() => setMapPickerVisible(false)}
        onConfirm={handleMapConfirm}
        initialLatitude={getMapPickerInitial().lat}
        initialLongitude={getMapPickerInitial().lng}
        title={getMapPickerTitle()}
      />
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
  roleSelector: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.authBorder,
    backgroundColor: COLORS.authInput,
  },
  roleButtonActive: {
    backgroundColor: COLORS.onboardingPrimary,
    borderColor: COLORS.onboardingPrimary,
  },
  roleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  roleButtonTextActive: {
    color: "#FFFFFF",
  },
  form: {
    gap: 14,
  },
  merchantSection: {
    backgroundColor: COLORS.authInput,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
    padding: 16,
    gap: 14,
  },
  merchantSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  merchantSectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.authAccent,
  },
  merchantSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  merchantForm: {
    gap: 14,
  },
  bottomSection: {
    gap: 14,
    marginTop: 8,
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
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  mapPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
    backgroundColor: COLORS.authInput,
    paddingHorizontal: 16,
    gap: 10,
  },
  mapPickerText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.authPlaceholder,
  },
  mapPickerTextFilled: {
    color: COLORS.textPrimary,
  },
});
