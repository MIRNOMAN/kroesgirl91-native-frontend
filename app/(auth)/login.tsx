import { useRouter } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "../../components/ui/auth/AuthButton";
import AuthLabeledInput from "../../components/ui/auth/AuthLabeledInput";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.authBg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.content}>
            <AuthTitleBlock
              title="Sign In Account"
              subtitle="Start your journey in playmate with fun, interactive lessons now"
              titleSize={31}
              subtitleSize={11}
              subtitleMaxWidth={220}
            />

            <View style={styles.form}>
              <AuthLabeledInput
                label="Email"
                placeholder="Enter Email Here"
                keyboardType="email-address"
                autoCapitalize="none"
                compact
              />

              <AuthLabeledInput
                label="Password"
                placeholder="Enter Password Here"
                secureTextEntry
                showPasswordToggle
                compact
              />

              <Pressable
                onPress={() => router.push(APP_ROUTES.forgotPassword)}
                style={styles.forgotWrap}
              >
                <Text style={styles.forgotText}>Forgot Password</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.termsText}>
              By continuing, you confirm that you are 18 years or older and
              agree to our{" "}
              <Text style={styles.linkInline}>Terms & Conditions</Text> and
              <Text style={styles.linkInline}> Privacy Policy.</Text>
            </Text>

            <AuthButton
              title="Log In"
              onPress={() => router.replace(APP_ROUTES.home)}
            />

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don&apos;t have an account?</Text>
              <Pressable onPress={() => router.push(APP_ROUTES.register)}>
                <Text style={styles.signupLink}> Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.authBg,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  content: {
    gap: 16,
  },
  form: {
    gap: 10,
  },
  forgotWrap: {
    alignSelf: "flex-end",
  },
  forgotText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  bottomSection: {
    gap: 14,
  },
  termsText: {
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  linkInline: {
    color: COLORS.authAccent,
    fontWeight: "600",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: 10,
    color: COLORS.authAccent,
    fontWeight: "700",
  },
});
