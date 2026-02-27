import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AuthButton from "../../components/ui/auth/AuthButton";
import AuthLabeledInput from "../../components/ui/auth/AuthLabeledInput";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AuthTitleBlock
          title="Create An Account"
          subtitle="Create your account to get into the unlimited options of payments & convenience."
        />

        <View style={styles.form}>
          <AuthLabeledInput
            label="Full Name"
            placeholder="Enter Full Name Here"
          />
          <AuthLabeledInput
            label="Email"
            placeholder="Enter Email Here"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AuthLabeledInput
            label="Password"
            placeholder="Enter Password Here"
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.termsText}>
          By continuing, you confirm that you are 18 years or older and agree to
          our <Text style={styles.linkInline}>Terms & Conditions</Text> and
          <Text style={styles.linkInline}> Privacy Policy.</Text>
        </Text>

        <AuthButton
          title="Sign Up"
          onPress={() => router.push(APP_ROUTES.otp)}
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Pressable onPress={() => router.push(APP_ROUTES.login)}>
            <Text style={styles.loginLink}> Log In</Text>
          </Pressable>
        </View>
      </View>
    </View>
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
    gap: 24,
  },
  form: {
    gap: 14,
  },
  bottomSection: {
    gap: 14,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  linkInline: {
    color: COLORS.authAccent,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    color: COLORS.authAccent,
    fontWeight: "700",
  },
});
