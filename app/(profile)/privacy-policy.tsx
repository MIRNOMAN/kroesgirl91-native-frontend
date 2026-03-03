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
            >
              {/* Last Update */}
              <View style={styles.updateInfo}>
                <Text style={styles.updateDate}>
                  Last Update: 19 March 2025
                </Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.paragraph}>
                  But I must explain to you how all this mistaken idea of
                  denouncing pleasure and praising pain was born and I will give
                  you a complete account of the system, and expound the actual
                  teachings of the great explorer of the truth, the
                  master-builder of human happiness. No one rejects, dislikes,
                  or avoids pleasure itself, because it is pleasure, but because
                  those who do not know how to pursue pleasure rationally
                  encounter consequences that are extremely painful.
                </Text>
                <Text style={styles.paragraph}>
                  Itself, because it is pain, but because occasionally
                  circumstances occur in which toil and pain can procure him
                  some great pleasure. To take a trivial example, which of us
                  ever undertakes laborious physical exercise, except to obtain
                  some advantage from it? But who has any right to find fault
                  with a man who chooses to enjoy a pleasure that has no
                  annoying consequences, or one who avoids a pain that produces
                  no resultant pleasure. But I must explain to you how all this
                  mistaken idea of denouncing
                </Text>
                <Text style={styles.paragraph}>
                  pleasure and praising pain was born and I will give you a
                  complete account of the system, and expound the actual
                  teachings of the great explorer of the truth, the
                  master-builder of human happiness. No one rejects, dislikes,
                  or avoids pleasure itself, because it is pleasure, but because
                  those who do not know how to pursue pleasure
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
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: "justify",
  },
});
