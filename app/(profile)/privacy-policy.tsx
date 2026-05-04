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

export default function PrivacyPolicyScreen() {
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
              title="Privacy Policy"
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
              {/* Last Update
              <View style={styles.updateInfo}>
                <Text style={styles.updateDate}>Last Update: May 2026</Text>
              </View> */}

              {/* Content */}
              <View style={styles.content}>
                <View>
                  <Text style={styles.sectionHeading}>1. Data we collect</Text>
                  <Text style={styles.paragraph}>
                    We may collect the following data:
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • Name, phone number, and email address
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • Pickup and delivery addresses
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • Payment details (securely processed)
                  </Text>
                  <Text style={styles.bulletPoint}>• Use of the app</Text>
                </View>

                <View>
                  <Text style={styles.sectionHeading}>2. Use of data</Text>
                  <Text style={styles.paragraph}>We use your data to:</Text>
                  <Text style={styles.bulletPoint}>• Carry out deliveries</Text>
                  <Text style={styles.bulletPoint}>
                    • Communicate order updates
                  </Text>
                  <Text style={styles.bulletPoint}>• Improve our services</Text>
                  <Text style={styles.bulletPoint}>
                    • Provide customer service
                  </Text>
                </View>

                <View>
                  <Text style={styles.sectionHeading}>3. Sharing of data</Text>
                  <Text style={styles.paragraph}>
                    We may share limited data with:
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • Riders (for carrying out deliveries)
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • Payment service providers
                  </Text>
                  <Text style={styles.paragraph}>
                    We do not sell your data to third parties.
                  </Text>
                </View>

                <View>
                  <Text style={styles.sectionHeading}>4. Security</Text>
                  <Text style={styles.paragraph}>
                    We take reasonable measures to protect your data, but no
                    system is completely secure.
                  </Text>
                </View>

                <View>
                  <Text style={styles.sectionHeading}>5. Retention period</Text>
                  <Text style={styles.paragraph}>
                    We retain data only for as long as necessary for operational
                    and legal purposes.
                  </Text>
                </View>

                <View>
                  <Text style={styles.sectionHeading}>6. Your rights</Text>
                  <Text style={styles.paragraph}>You have the right to:</Text>
                  <Text style={styles.bulletPoint}>
                    • Request access to your data
                  </Text>
                  <Text style={styles.bulletPoint}>• Request corrections</Text>
                  <Text style={styles.bulletPoint}>
                    • Request deletion of your account
                  </Text>
                </View>

                <View>
                  <Text style={styles.sectionHeading}>
                    7. Cookies and tracking
                  </Text>
                  <Text style={styles.paragraph}>
                    The app may use basic tracking technologies to improve user
                    experience.
                  </Text>
                </View>

                <View>
                  <Text style={styles.sectionHeading}>8. Changes</Text>
                  <Text style={styles.paragraph}>
                    We may amend this privacy policy. By continuing to use
                    SwiftDrop, you agree to the changes.
                  </Text>
                </View>
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
  updateDate: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  content: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: "justify",
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginLeft: 8,
    marginBottom: 4,
  },
});
