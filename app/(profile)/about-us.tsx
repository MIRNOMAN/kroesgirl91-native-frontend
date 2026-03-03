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

export default function AboutUsScreen() {
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
              title="About Us"
              showBackButton
              onBackPress={() => router.back()}
            />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.sectionTitle}>Who We Are</Text>
                <Text style={styles.paragraph}>
                  We are a leading logistics and shipping company dedicated to
                  providing fast, reliable, and affordable delivery services.
                  Our mission is to connect people and businesses through
                  seamless shipping solutions.
                </Text>

                <Text style={styles.sectionTitle}>Our Mission</Text>
                <Text style={styles.paragraph}>
                  To revolutionize the shipping industry by leveraging
                  technology and innovation to deliver packages safely and on
                  time, every time. We believe in transparency, reliability, and
                  customer satisfaction.
                </Text>

                <Text style={styles.sectionTitle}>Our Values</Text>
                <Text style={styles.paragraph}>
                  • Customer First: Your satisfaction is our priority{"\n"}•
                  Reliability: We deliver on our promises{"\n"}• Innovation:
                  Constantly improving our services{"\n"}• Integrity: Honest and
                  transparent business practices{"\n"}• Sustainability:
                  Committed to eco-friendly operations
                </Text>

                <Text style={styles.sectionTitle}>Contact Us</Text>
                <Text style={styles.paragraph}>
                  Email: support@kroesgirl.com{"\n"}
                  Phone: +1 800 123 4567{"\n"}
                  Address: 123 Shipping Lane, Logistics City, LC 12345
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
  },
  content: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
});
