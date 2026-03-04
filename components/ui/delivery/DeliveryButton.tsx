import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
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
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#F5A623" : "#FFFFFF"}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
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
    borderColor: "#002B3B",
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
