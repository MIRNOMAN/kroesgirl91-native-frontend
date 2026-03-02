import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import AuthButton from "../../components/ui/auth/AuthButton";
import AuthLabeledInput from "../../components/ui/auth/AuthLabeledInput";
import AuthTitleBlock from "../../components/ui/auth/AuthTitleBlock";
import { COLORS } from "../../constants/colors";
import { APP_ROUTES } from "../../constants/routes";

export default function ResetPasswordScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AuthTitleBlock
          title="Reset Password"
          subtitle="Add your new password"
          titleSize={31}
          subtitleSize={16}
          subtitleMaxWidth={180}
        />

        <View style={styles.form}>
          <AuthLabeledInput
            label="New Password"
            placeholder="Enter New Password Here"
            secureTextEntry
            showPasswordToggle
            compact
          />
          <AuthLabeledInput
            label="Confirm Password"
            placeholder="Enter Password Here"
            secureTextEntry
            showPasswordToggle
            compact
          />
        </View>
      </View>

      <AuthButton
        title="Reset Password"
        onPress={() => router.replace(APP_ROUTES.resetSuccess)}
      />
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
    gap: 36,
  },
  form: {
    gap: 20,
  },
});
