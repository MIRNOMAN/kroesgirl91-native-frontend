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

  const handlePress = () => {
    // Small timeout ensures the layout hierarchy processes the pointer event safely
    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 40);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.boxes} onPress={handlePress}>
        {digits.map((digit, index) => {
          // Highlight active box or if the character is filled
          const isFocusedBox = index === value.length;

          return (
            <View
              key={index}
              style={[styles.box, isFocusedBox && styles.focusedBox]}>
              <Text style={[styles.digit, !digit && styles.placeholderDigit]}>
                {digit || "0"}
              </Text>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={hiddenInputRef}
        value={value}
        onChangeText={(text) => {
          // Keep only numeric characters up to specified length limit
          const sanitized = text.replace(/\D/g, "").slice(0, length);
          onChange(sanitized);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode" // iOS AutoFill helper for SMS codes
        autoComplete="sms-otp" // Android AutoFill helper for SMS codes
        maxLength={length}
        style={styles.hiddenInput}
        caretHidden={true} // Hide cursor glitching elsewhere on screen
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
  focusedBox: {
    borderColor: COLORS.onboardingPrimary, // Optional indicator logic for active typing slot
    borderWidth: 2,
  },
  digit: {
    fontSize: 24, // Shifted from 30 down to 24 for clean system padding alignment
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01, // 0.01 prevents the layout engine from ignoring focusability rules
    color: "transparent",
    backgroundColor: "transparent",
  },
  placeholderDigit: {
    opacity: 0.25,
  },
});
