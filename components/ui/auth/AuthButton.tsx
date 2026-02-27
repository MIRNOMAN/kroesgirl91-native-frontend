import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../../../constants/colors";

type AuthButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export default function AuthButton({
  title,
  onPress,
  variant = "primary",
}: AuthButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: COLORS.onboardingPrimary,
  },
  secondary: {
    backgroundColor: COLORS.authMuted,
  },
  text: {
    fontSize: 17,
    fontWeight: "700",
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.textPrimary,
  },
  pressed: {
    opacity: 0.9,
  },
});
