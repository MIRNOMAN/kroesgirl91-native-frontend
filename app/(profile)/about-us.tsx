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
              scrollEnabled={true}
              nestedScrollEnabled={false}
            >
              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.sectionTitle}>
                  About SwiftDrop Logistics
                </Text>
                <Text style={styles.paragraph}>
                  SwiftDrop Logistics is a fast, reliable, and modern delivery
                  service designed to make sending and receiving packages simple
                  for everyone in Suriname. Whether you are an entrepreneur or a
                  private individual, SwiftDrop connects you with reliable
                  riders who deliver your shipments quickly and safely.
                </Text>

                <Text style={styles.sectionTitle}>What We Do</Text>
                <Text style={styles.paragraph}>
                  We specialize in same-day deliveries and help businesses reach
                  their customers faster, while private individuals can easily
                  send packages without any hassle. From documents and packages
                  to retail orders – SwiftDrop ensures that every delivery is
                  executed carefully and efficiently.
                </Text>

                <Text style={styles.sectionTitle}>Our Mission</Text>
                <Text style={styles.paragraph}>
                  To simplify logistics by combining speed, transparency, and
                  ease of use in a platform. We are committed to providing a
                  seamless delivery experience for all our users.
                </Text>

                <Text style={styles.sectionTitle}>Why Choose SwiftDrop</Text>
                <Text style={styles.bulletList}>
                  • Fast and reliable same-day deliveries{"\n"}• Professional
                  and trustworthy riders{"\n"}• Transparent pricing and
                  real-time tracking{"\n"}• Simple and user-friendly app{"\n"}•
                  Secure payment processing
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
  bulletList: {
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
});
