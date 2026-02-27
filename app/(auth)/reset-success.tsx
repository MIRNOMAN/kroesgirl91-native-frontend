import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function ResetSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.overlay}>
      <Pressable
        style={styles.backdrop}
        onPress={() => router.replace(APP_ROUTES.login)}
      />

      <View style={styles.popup}>
        <View style={styles.iconWrap}>
          <Ionicons
            name="cube"
            size={42}
            color={COLORS.authAccent}
            style={styles.boxIcon}
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
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  popup: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.authInput,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  boxIcon: {
    transform: [{ rotate: "-18deg" }],
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  loader: {
    marginTop: 12,
  },
});
