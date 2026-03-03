import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface TripSuccessModalProps {
  visible: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  onGoHome?: () => void;
  onClose?: () => void;
}

export default function TripSuccessModal({
  visible,
  title,
  subtitle,
  buttonText,
  onGoHome,
  onClose,
}: TripSuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Success Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require("../../../assets/successfull/successfull.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Success Message */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Go to Home Button */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={onGoHome}
            activeOpacity={0.8}
          >
            <Text style={styles.homeButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: isSmallDevice ? 32 : 40,
    paddingHorizontal: isSmallDevice ? 24 : 32,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  illustrationContainer: {
    width: isSmallDevice ? 140 : 160,
    height: isSmallDevice ? 140 : 160,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: "700",
    color: "#003C52",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#A0A0A0",
    textAlign: "center",
  },
  homeButton: {
    backgroundColor: "#00B4D8",
    borderRadius: 12,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    paddingHorizontal: isSmallDevice ? 40 : 48,
    width: "100%",
    alignItems: "center",
  },
  homeButtonText: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
