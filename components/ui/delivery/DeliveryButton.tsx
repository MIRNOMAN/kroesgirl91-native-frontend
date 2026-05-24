import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface DeliveryButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
}

const DeliveryButton: React.FC<DeliveryButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return [styles.button, styles.secondaryButton];
      case "outline":
        return [styles.button, styles.outlineButton];
      default:
        return [styles.button, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "secondary":
        return [styles.buttonText, styles.secondaryButtonText];
      case "outline":
        return [styles.buttonText, styles.outlineButtonText];
      default:
        return [styles.buttonText, styles.primaryButtonText];
    }
  };

  return (
    <Pressable
      style={[getButtonStyle(), disabled ? styles.disabledButton : null]}
      onPress={() => {
        if (disabled || loading) {
          return null;
        }
        onPress();
      }}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#F5A623" : "#FFFFFF"}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: isSmallDevice ? 16 : 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: "#002B3B",
  },
  secondaryButton: {
    backgroundColor: "#002B3B",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#002B3B33",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
  },
  outlineButtonText: {
    color: "#002B3B",
  },
});

export default DeliveryButton;
