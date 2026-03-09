import { FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import React from "react";
import {  StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";

interface ProfileCardProps {
  name: string;
  email: string;
  phone: string;
  // avatar: string;
  onEditPress?: () => void;
}

export default function ProfileCard({
  name,
  email,
  phone,
  
  onEditPress,
}: ProfileCardProps) {
  return (
    <View style={styles.container}>
      {/* Edit Icon on top-right */}
      {onEditPress && (
        <TouchableOpacity style={styles.editBtn} onPress={onEditPress}>
          <FontAwesome name="edit" size={22} color="#FEB334" />
        </TouchableOpacity>
      )}

      <View style={styles.profileInfo}>
        {/* <Image source={{ uri: avatar }} style={styles.avatar} /> */}

        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{name}</Text>

          <View style={styles.row}>
            <Fontisto name="email" size={16} color="#FEB334" />
            <Text style={styles.profileEmail}>{email}</Text>
          </View>

          <View style={styles.row}>
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: "relative", // required for absolute positioning of edit icon
  },

  editBtn: {
    position: "absolute",
    top: 12,
    right: 12,
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

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  profileEmail: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },

  profilePhone: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
});