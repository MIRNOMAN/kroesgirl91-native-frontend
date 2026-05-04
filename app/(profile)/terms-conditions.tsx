import { useRouter } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileHeader } from "../../components/ui/profile";
import { COLORS } from "../../constants/colors";

export default function TermsConditionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            {/* Header */}
            <ProfileHeader
              title="Terms & Conditions"
              showBackButton
              onBackPress={() => router.back()}
            />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              nestedScrollEnabled={false}
            >
              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.sectionTitle}>1. Introduction</Text>
                <Text style={styles.paragraph}>
                  These General Terms and Conditions apply to the use of the
                  Swiftdrop app and services . By using Swiftdrop , you agree to
                  these terms .
                </Text>

                <Text style={styles.sectionTitle}>2. Services</Text>
                <Text style={styles.paragraph}>
                  Swiftdrop Logistic offers on-demand delivery services by
                  connecting users with independent delivery drivers ( “ riders
                  ” ) .
                </Text>

                <Text style={styles.sectionTitle}>
                  3. User Responsibilities
                </Text>
                <Text style={styles.paragraph}>You agree to :</Text>
                <Text style={styles.listItem}>
                  * Provide correct pickup and delivery information
                </Text>
                <Text style={styles.listItem}>* Pack shipments properly</Text>
                <Text style={styles.listItem}>
                  * Not ship prohibited or illegal goods
                </Text>
                <Text style={styles.listItem}>
                  * Be available to coordinate pickup and delivery
                </Text>

                <Text style={styles.sectionTitle}>4. Prohibited Goods</Text>
                <Text style={styles.paragraph}>
                  It is not permitted to ship the following items :
                </Text>
                <Text style={styles.listItem}>* Illegal goods</Text>
                <Text style={styles.listItem}>* Dangerous substances</Text>
                <Text style={styles.listItem}>* Weapons or explosives</Text>
                <Text style={styles.listItem}>
                  * Perishable goods ( unless permitted later by Swiftdrop )
                </Text>
                <Text style={styles.listItem}>
                  * Valuable goods without prior notification
                </Text>
                <Text style={styles.paragraph}>
                  Swiftdrop reserves the right to refuse shipments .
                </Text>

                <Text style={styles.sectionTitle}>5. Prices and Payments</Text>
                <Text style={styles.paragraph}>
                  * Delivery costs are calculated based on distance and type of
                  service * Payment must be made before or upon delivery (
                  depending of the chosen method) * Costs are not refunded after
                  successful delivery
                </Text>

                <Text style={styles.sectionTitle}>6. Cancellations</Text>
                <Text style={styles.paragraph}>
                  * Orders can be cancelled before a rider has been assigned *
                  Cancellations after assignment are not possible and will incur
                  costs
                </Text>

                <Text style={styles.sectionTitle}>7. Liability</Text>
                <Text style={styles.paragraph}>
                  Swiftdrop Logistic is not liable for:
                </Text>
                <Text style={styles.listItem}>
                  * Delays due to traffic, weather conditions or other
                  unforeseen situations
                </Text>
                <Text style={styles.listItem}>
                  * Damage due to poor packaging
                </Text>
                <Text style={styles.listItem}>
                  * Indirect or consequential damage Limited liability may apply
                  in the event of demonstrable negligence .
                </Text>

                <Text style={styles.sectionTitle}>9. Account Termination</Text>
                <Text style={styles.paragraph}>
                  Swiftdrop reserves the right to suspend or terminate accounts
                  in the event of abuse, fraud or violation of these terms and
                  conditions.
                </Text>

                <Text style={styles.sectionTitle}>10. Changes</Text>
                <Text style={styles.paragraph}>
                  Swiftdrop Logistic may amend these terms and conditions at any
                  time. By continuing to use the app, you agree to the changes.
                </Text>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    flexGrow: 1,
  },
  updateInfo: {
    marginBottom: 20,
  },
  updateLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  updateDate: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  content: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: "justify",
  },
  listItem: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginLeft: 8,
    marginTop: 6,
  },
});
