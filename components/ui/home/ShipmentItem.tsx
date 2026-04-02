import React from "react";
import {  StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";

export interface ShipmentItemProps {
  id: string;
  name: string;
 tookanJobId?: string;
  status?: string;
  onPress?: () => void;
}

export default function ShipmentItem({
  id,
  name,
  
  status = "On process",
  onPress,
}: ShipmentItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
  
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.trackingId}>ID: {id}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#E0E0E0",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  trackingId: {
    fontSize: 13,
    color: "#999999",
  },
  statusBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    color: "#FF9800",
    fontWeight: "500",
  },
});
