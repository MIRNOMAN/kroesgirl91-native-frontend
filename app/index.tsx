import { useAppSelector } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DotSpinner from "../components/ui/DotSpinner";
import { APP_ROUTES } from "../constants/routes";

const ONBOARDING_SEEN_KEY = "onboarding_seen";

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isAuthenticated) {
        router.replace(APP_ROUTES.home);
        return;
      }

      const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
      router.replace(
        hasSeenOnboarding === "true" ? APP_ROUTES.login : APP_ROUTES.onboarding,
      );
    }, 2200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/splashscreen/SVG-01.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.loader}>
          <DotSpinner />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#003C51",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003C51",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
  },
  logo: {
    width: 620,
    height: 140,
  },
  loader: {
    marginBottom: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
