import { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../../../constants/colors";

type OtpCodeInputProps = {
  value: string;
  onChange: (next: string) => void;
  length?: number;
};

export default function OtpCodeInput({
  value,
  onChange,
  length = 4,
}: OtpCodeInputProps) {
  const hiddenInputRef = useRef<TextInput>(null);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.boxes}
        onPress={() => hiddenInputRef.current?.focus()}
      >
        {digits.map((digit, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.digit}>{digit}</Text>
          </View>
        ))}
      </Pressable>

      <TextInput
        ref={hiddenInputRef}
        value={value}
        onChangeText={(text) => {
          const sanitized = text.replace(/\D/g, "").slice(0, length);
          onChange(sanitized);
        }}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },
  boxes: {
    flexDirection: "row",
    gap: 14,
  },
  box: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
    backgroundColor: COLORS.authInput,
    alignItems: "center",
    justifyContent: "center",
  },
  digit: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    width: "100%",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
});
