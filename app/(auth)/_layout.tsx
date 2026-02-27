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
      <Stack.Screen
        name="login"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot Password", headerShown: false }}
      />
      <Stack.Screen
        name="forgot-otp"
        options={{ title: "Forgot OTP", headerShown: false }}
      />
      <Stack.Screen
        name="reset-password"
        options={{ title: "Reset Password", headerShown: false }}
      />
      <Stack.Screen
        name="reset-success"
        options={{ title: "Reset Success", headerShown: false }}
      />
      <Stack.Screen name="otp" options={{ title: "OTP", headerShown: false }} />
      <Stack.Screen
        name="verify-otp"
        options={{ title: "Verify OTP", headerShown: false }}
      />
    </Stack>
  );
}
