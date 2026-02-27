import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";
import CustomButton from "../../components/ui/CustomButton";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Overview of your latest activity</Text>
      <CustomButton
        title="Go to Tracking"
        onPress={() => router.push(APP_ROUTES.tracking)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
});
