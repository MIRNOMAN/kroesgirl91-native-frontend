import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";

interface ProfileMenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  onPress: () => void;
  showBorder?: boolean;
}

export default function ProfileMenuItem({
  icon,
  title,
  onPress,
  showBorder = true,
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, showBorder && styles.withBorder]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Feather name={icon} size={20} color={COLORS.authAccent} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Feather
        name="chevron-right"
        size={20}
        color={COLORS.textSecondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#FEB3341A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
});