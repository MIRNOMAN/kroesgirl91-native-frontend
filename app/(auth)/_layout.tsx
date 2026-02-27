import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="onboarding"
        options={{ title: "Onboarding", headerShown: false }}
      />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot Password" }}
      />
      <Stack.Screen name="otp" options={{ title: "OTP" }} />
      <Stack.Screen name="verify-otp" options={{ title: "Verify OTP" }} />
    </Stack>
  );
}
