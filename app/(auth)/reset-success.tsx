import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function ResetSuccessScreen() {
  const router = useRouter();

  // Auto redirect after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(APP_ROUTES.login);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        {/* Click outside to close */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => router.replace(APP_ROUTES.login)}
        />

        <View style={styles.popup}>
          <View style={styles.iconWrap}>
            <Image
              source={require("../../assets/successfull/successfull.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.subtitle}>Your location is set manually.</Text>

          <ActivityIndicator
            size="small"
            color={COLORS.textSecondary}
            style={styles.loader}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  popup: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  iconWrap: {
    width: 202,
    height: 202,

    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  loader: {
    marginTop: 16,
  },
});
