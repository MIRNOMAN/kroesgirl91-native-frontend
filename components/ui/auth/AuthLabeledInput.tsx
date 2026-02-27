import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { COLORS } from "../../../constants/colors";

type AuthLabeledInputProps = TextInputProps & {
  label: string;
  compact?: boolean;
  showPasswordToggle?: boolean;
};

export default function AuthLabeledInput({
  label,
  compact = false,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}: AuthLabeledInputProps) {
  const [isSecure, setIsSecure] = useState(Boolean(secureTextEntry));

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, compact && styles.labelCompact]}>
        {label}
      </Text>
      <View style={[styles.inputWrap, compact && styles.inputWrapCompact]}>
        <TextInput
          style={[styles.input, compact && styles.inputCompact]}
          placeholderTextColor={COLORS.authPlaceholder}
          secureTextEntry={isSecure}
          {...props}
        />
        {showPasswordToggle ? (
          <Pressable
            onPress={() => setIsSecure((current) => !current)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={16}
              color={COLORS.authPlaceholder}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 8,
  },
  label: {
    fontSize: 21,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  labelCompact: {
    fontSize: 12,
    fontWeight: "600",
  },
  inputWrap: {
    width: "100%",
    position: "relative",
  },
  inputWrapCompact: {
    borderRadius: 10,
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
    backgroundColor: COLORS.authInput,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  inputCompact: {
    height: 42,
    borderRadius: 10,
    fontSize: 12,
    paddingHorizontal: 12,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
});
