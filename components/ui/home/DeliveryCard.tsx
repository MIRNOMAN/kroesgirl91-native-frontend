import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";

interface DeliveryCardProps {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export default function DeliveryCard({
  title,
  subtitle,
  onPress,
}: DeliveryCardProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>+ Create New</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D6E8F5",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});
