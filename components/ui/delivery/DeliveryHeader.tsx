import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface DeliveryHeaderProps {
  title: string;
  onBackPress: () => void;
}

const DeliveryHeader: React.FC<DeliveryHeaderProps> = ({
  title,
  onBackPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons name="chevron-back" size={24} color="#1A3A4A" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingVertical: isSmallDevice ? 12 : 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "600",
    color: "#1A3A4A",
  },
  placeholder: {
    width: 40,
  },
});

export default DeliveryHeader;
