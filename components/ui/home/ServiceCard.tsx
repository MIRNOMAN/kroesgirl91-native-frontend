import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress?: () => void;
}

export default function ServiceCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: ServiceCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: color }]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minHeight: 100,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  iconContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  icon: {
    fontSize: 32,
  },
});
