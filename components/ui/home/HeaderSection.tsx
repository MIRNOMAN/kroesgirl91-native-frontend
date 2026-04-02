import { useGetMeUserQuery } from "@/redux/api/userApi";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../constants/colors";

interface HeaderSectionProps {
  greeting: string;
}

export default function HeaderSection({ greeting }: HeaderSectionProps) {
  const { data, isLoading } = useGetMeUserQuery();
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>
            {isLoading ? "Loading..." : data?.data?.fullName || "User"}
          </Text>
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
    fontSize: 17,
    color: COLORS.textSecondary,
    fontWeight: "700",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});
