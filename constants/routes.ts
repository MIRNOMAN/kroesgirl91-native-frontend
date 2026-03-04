import { Href } from "expo-router";

export const APP_ROUTES = {
  onboarding: "/onboarding" as Href,
  login: "/login" as Href,
  register: "/register" as Href,
  forgotPassword: "/forgot-password" as Href,
  forgotOtp: "/forgot-otp" as Href,
  resetPassword: "/reset-password" as Href,
  resetSuccess: "/reset-success" as Href,
  otp: "/otp" as Href,
  verifyOtp: "/verify-otp" as Href,
  home: "/home" as Href,
  businessBulk: "/(tabs)/business-bulk" as Href,
  tracking: "/tracking" as Href,
  shipment: "/shipment" as Href,
  profile: "/profile" as Href,
  editProfile: "/(profile)/edit-profile" as Href,
  changePassword: "/(profile)/change-password" as Href,
  termsConditions: "/(profile)/terms-conditions" as Href,
  privacyPolicy: "/(profile)/privacy-policy" as Href,
  aboutUs: "/(profile)/about-us" as Href,
} as const;
