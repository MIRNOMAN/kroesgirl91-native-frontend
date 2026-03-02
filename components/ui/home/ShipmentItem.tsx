import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";

interface ShipmentItemProps {
  id: string;
  date: string;
  destination: string;
  onPress?: () => void;
}

export default function ShipmentItem({
  id,
  date,
  destination,
  onPress,
}: ShipmentItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name="cube" size={24} color={COLORS.textPrimary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.id}>Frank Johnson</Text>
        <Text style={styles.destination}>{destination}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.status}>In progress</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  id: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  destination: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  status: {
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "600",
  },
});
