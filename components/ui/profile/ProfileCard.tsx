import { FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";

interface ProfileCardProps {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  onEditPress?: () => void;
}

export default function ProfileCard({
  name,
  email,
  phone,
  avatar,
  onEditPress,
}: ProfileCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.profileDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>{name}</Text>
            {onEditPress && (
              <TouchableOpacity onPress={onEditPress}>
                <FontAwesome name="edit" size={22} color="#FEB334" />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              marginTop: 6,
            }}
          >
            <Fontisto name="email" size={16} color="#FEB334" />
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <Ionicons name="call-outline" size={16} color="#FEB334" />
            <Text style={styles.profilePhone}>{phone}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowRadius: 4,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 40,
    borderWidth: 7,
    borderColor: COLORS.borderRounded,
    marginRight: 14,
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  profileEmail: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
