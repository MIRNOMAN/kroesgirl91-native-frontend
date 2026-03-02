import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../constants/colors";

interface HeaderSectionProps {
  greeting: string;
  name: string;
  avatar?: string;
}

export default function HeaderSection({
  greeting,
  name,
  avatar,
}: HeaderSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={24} color={COLORS.textSecondary} />
          </View>
        )}
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <Ionicons
        name="notifications-outline"
        size={24}
        color={COLORS.textPrimary}
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});
