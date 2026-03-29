import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { COLORS } from "../../constants/colors";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}: CustomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#073342",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.55,
  },
});
