import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { COLORS } from "../../../constants/colors";

type AuthLabeledInputProps = TextInputProps & {
  label: string;
};

export default function AuthLabeledInput({
  label,
  ...props
}: AuthLabeledInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.authPlaceholder}
        {...props}
      />
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
});
