import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
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
    <ImageBackground
      source={require("../../../assets/backround/backround_3.png")} 
      style={styles.container}
      imageStyle={styles.imageStyle}
      resizeMode="cover"
    >
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>+ Create New</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    height: 100,
    marginHorizontal: 20,
    marginVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden", 
  },
  imageStyle: {
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});