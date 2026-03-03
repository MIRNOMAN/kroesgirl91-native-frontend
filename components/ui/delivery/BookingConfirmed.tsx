import React from "react";
import { Dimensions, Image, Modal, StyleSheet, Text, View } from "react-native";
import DeliveryButton from "./DeliveryButton";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface BookingConfirmedProps {
  visible: boolean;
  title: string;
  subtitle: string;
  onTrackShipment: () => void;
  onBackToHome: () => void;
}

const BookingConfirmed: React.FC<BookingConfirmedProps> = ({
  visible,
  title,
  subtitle,
  onTrackShipment,
  onBackToHome,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <DeliveryButton
              title="Track Shipment"
              onPress={onTrackShipment}
              variant="outline"
            />
            <DeliveryButton
              title="Back to Home"
              onPress={onBackToHome}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    paddingHorizontal: isSmallDevice ? 20 : 24,
    paddingVertical: isSmallDevice ? 30 : 40,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  illustrationContainer: {
    width: isSmallDevice ? 120 : 150,
    height: isSmallDevice ? 120 : 150,
    marginBottom: isSmallDevice ? 20 : 24,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: "700",
    color: "#1A3A4A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: isSmallDevice ? 24 : 32,
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
  },
});

export default BookingConfirmed;
