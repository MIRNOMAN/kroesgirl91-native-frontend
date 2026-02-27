import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import CustomSpinner from "../components/ui/CustomSpinner";
import { APP_ROUTES } from "../constants/routes";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(APP_ROUTES.onboarding);
    }, 2200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#003C51" />
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/splashscreen/Group.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.loader}>
          <CustomSpinner size={38} color="#FFFFFF" duration={900} />
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
    width: 210,
    height: 95,
  },
  loader: {
    marginBottom: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
