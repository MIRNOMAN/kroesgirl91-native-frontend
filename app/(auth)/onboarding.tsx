import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";

// Mocking these since I don't have your constants file
// Replace these imports with your actual constant files
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
};

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
  const flatListRef = useRef<FlatList>(null);

  // Updates the dot index based on which slide is mostly visible
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onNext = () => {
    if (activeIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      router.replace(APP_ROUTES.login);
    }
  };

  const onBack = () => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
    }
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <View style={styles.illustrationArea}>
        <View style={styles.illustrationCircle}>
          <Image
            source={item.image}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.description}</Text>
      </View>
    </View>
  );

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

      {/* Content Slider */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

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
    width: SCREEN_WIDTH,
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
    borderRadius: (SCREEN_WIDTH * 0.7) / 2,

    alignItems: "center",
    justifyContent: "center",
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
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
