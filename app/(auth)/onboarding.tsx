import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  surface: "#FFFFFF",
  border: "#E0E0E0",
  textPrimary: "#1A1A1A",
  textSecondary: "#666666",
  onboardingTint: "#F0F7FF",
  onboardingDot: "#D1D1D1",
  onboardingPrimary: "#002B3B",
  white: "#FFFFFF",
};

const APP_ROUTES = {
  login: "/login",
} as const;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};

const ONBOARDING_DATA: OnboardingItem[] = [
  {
    id: "1",
    title: "Fast Delivery, Zero Hassle",
    description:
      "Book a pickup in seconds and let SwiftDrop handle the rest — simple, smooth, reliable.",
    image: require("../../assets/onboarding/picture_1.png"),
  },
  {
    id: "2",
    title: "Track Every Move",
    description:
      "Stay updated in real-time with live tracking and instant status updates from pickup to delivery.",
    image: require("../../assets/onboarding/Picture_2.png"),
  },
  {
    id: "3",
    title: "Deliver with Confidence",
    description:
      "Secure handling, trusted riders, and flexible payment options — all in one powerful app.",
    image: require("../../assets/onboarding/Picture_3.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const onNext = () => {
    if (activeIndex < ONBOARDING_DATA.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      router.replace(APP_ROUTES.login);
    }
  };

  const onBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const currentItem = ONBOARDING_DATA[activeIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Row */}
      <View style={styles.topRow}>
        <Pressable
          onPress={onBack}
          hitSlop={15}
          style={[styles.iconButton, activeIndex === 0 && styles.hiddenButton]}
          disabled={activeIndex === 0}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </Pressable>

        <Pressable
          onPress={() => router.replace(APP_ROUTES.login)}
          hitSlop={15}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.slide}>
        <View style={styles.illustrationArea}>
          <View style={styles.illustrationCircle}>
            <Image
              source={currentItem.image}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentItem.title}</Text>
          <Text style={styles.subtitle}>{currentItem.description}</Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomRow}>
        <View style={styles.dotsRow}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable
          onPress={onNext}
          style={[
            styles.nextButton,
            activeIndex === ONBOARDING_DATA.length - 1 &&
              styles.getStartedButton,
          ]}
        >
          {activeIndex < ONBOARDING_DATA.length - 1 ? (
            <Ionicons name="arrow-forward" size={22} color={COLORS.white} />
          ) : (
            <Text style={styles.getStartedText}>Get Started</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenButton: {
    opacity: 0,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  illustrationArea: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationCircle: {
    aspectRatio: 1,
    borderRadius: (SCREEN_WIDTH * 0.9) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
  },
  textContainer: {
    flex: 0.4,
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    maxWidth: 280,
    lineHeight: 24,
    fontWeight: "400",
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.onboardingDot,
    marginRight: 6,
  },
  dotActive: {
    width: 34,
    borderRadius: 6,
    backgroundColor: COLORS.onboardingPrimary,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.onboardingPrimary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  getStartedButton: {
    width: "auto",
    paddingHorizontal: 24,
    borderRadius: 28,
  },
  getStartedText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
