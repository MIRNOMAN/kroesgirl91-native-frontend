import { COLORS } from "@/constants/colors";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AlertState = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText: string;
  cancelText: string;
};

export const useAppAlert = () => {
  const [state, setState] = React.useState<AlertState>({
    visible: false,
    title: "",
    message: "",
    onConfirm: undefined,
    confirmText: "OK",
    cancelText: "Cancel",
  });

  const showAlert = (
    title: string,
    message: string,
    onConfirm?: () => void,
    confirmText: string = "OK",
    cancelText: string = "Cancel",
  ) => {
    setState({
      visible: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
    });
  };

  const hideAlert = () => {
    setState((prev) => ({ ...prev, visible: false }));
  };

  const handleConfirm = () => {
    hideAlert();
    state.onConfirm?.();
  };

  const AlertModal = () => (
    <Modal
      transparent
      visible={state.visible}
      animationType="fade"
      onRequestClose={hideAlert}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{state.title}</Text>

          <Text style={styles.message}>{state.message}</Text>

          {/* OK button */}
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>{state.confirmText}</Text>
          </TouchableOpacity>

          {/* Cancel button */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={hideAlert}>
            <Text style={styles.cancelText}>{state.cancelText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return { showAlert, hideAlert, AlertModal };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "80%",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.textPrimary,
  },

  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },

  cancelButton: {
    backgroundColor: "#E5E7EB",
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  cancelText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
});
