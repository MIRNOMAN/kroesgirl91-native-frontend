import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TripSuccessModalProps = {
  visible: boolean;
  etaText?: string;
  onGoHome: () => void;
};

export default function TripSuccessModal({
  visible,
  etaText = "Estimated arrival time: 15 min",
  onGoHome,
}: TripSuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="checkmark-done-circle" size={74} color="#0F4C5C" />
          </View>

          <Text style={styles.title}>Successfully End Trip</Text>
          <Text style={styles.subtitle}>{etaText}</Text>

          <TouchableOpacity style={styles.button} onPress={onGoHome}>
            <Text style={styles.buttonText}>Go to home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
    elevation: 10,
  },
  iconWrap: {
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },
  button: {
    marginTop: 22,
    minHeight: 48,
    width: "100%",
    borderRadius: 14,
    backgroundColor: "#0F4C5C",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
