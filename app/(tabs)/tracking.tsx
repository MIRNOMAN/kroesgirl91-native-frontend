import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";
import CustomButton from "../../components/ui/CustomButton";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function TrackingScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Tracking</Text>
      <Text style={styles.subtitle}>Track shipments in real-time</Text>
      <CustomButton
        title="Go to Shipment"
        onPress={() => router.push(APP_ROUTES.shipment)}
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
