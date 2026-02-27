import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { COLORS } from "../../constants/colors";

type CustomInputProps = TextInputProps;

export default function CustomInput(props: CustomInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholderTextColor={COLORS.textSecondary}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    maxWidth: 320,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
  },
});
