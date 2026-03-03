import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface DeliveryInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "phone-pad" | "numeric" | "email-address";
  icon?: keyof typeof Ionicons.glyphMap;
  isLocationInput?: boolean;
  onLocationPress?: () => void;
  multiline?: boolean;
  editable?: boolean;
}

const DeliveryInput: React.FC<DeliveryInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  icon,
  isLocationInput = false,
  onLocationPress,
  multiline = false,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color="#999999"
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            isLocationInput && styles.inputWithLocation,
            multiline && styles.multilineInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#AAAAAA"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={editable}
        />
        {isLocationInput && (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={onLocationPress}
          >
            <Ionicons name="location" size={20} color="#F5A623" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: isSmallDevice ? 16 : 20,
  },
  label: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  leftIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    fontSize: isSmallDevice ? 14 : 15,
    color: "#333333",
    paddingVertical: isSmallDevice ? 14 : 16,
    paddingHorizontal: 16,
  },
  inputWithIcon: {
    paddingLeft: 12,
  },
  inputWithLocation: {
    paddingRight: 50,
  },
  multilineInput: {
    height: isSmallDevice ? 80 : 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  locationButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
});

export default DeliveryInput;
