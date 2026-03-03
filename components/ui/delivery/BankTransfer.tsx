import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeliveryButton from "./DeliveryButton";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface BankTransferProps {
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
  };
  onConfirm: () => void;
}

const BankTransfer: React.FC<BankTransferProps> = ({
  bankDetails,
  onConfirm,
}) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setScreenshot(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Upload Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Payment Screenshot</Text>
        <Text style={styles.sectionSubtitle}>
          Upload a screenshot of your payment confirmation
        </Text>

        <TouchableOpacity
          style={styles.uploadArea}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          {screenshot ? (
            <Image source={{ uri: screenshot }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.uploadIconContainer}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={32}
                  color="#F5A623"
                />
              </View>
              <Text style={styles.uploadText}>Click to upload</Text>
              <Text style={styles.uploadHint}>PNG, JPG up to 10MB</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Bank Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank transfer</Text>

        <View style={styles.bankCard}>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Bank Name</Text>
            <Text style={styles.bankValue}>{bankDetails.bankName}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Account Name</Text>
            <Text style={styles.bankValue}>{bankDetails.accountName}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Account Number</Text>
            <Text style={styles.bankValue}>{bankDetails.accountNumber}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Routing Number</Text>
            <Text style={styles.bankValue}>{bankDetails.routingNumber}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <DeliveryButton
          title="Confirm booking"
          onPress={onConfirm}
          variant="secondary"
          disabled={!screenshot}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  section: {
    marginBottom: isSmallDevice ? 20 : 24,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "600",
    color: "#1A3A4A",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#666666",
    marginBottom: 16,
  },
  uploadArea: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    borderStyle: "dashed",
    minHeight: isSmallDevice ? 150 : 180,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    alignItems: "center",
    padding: 20,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF5E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A3A4A",
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 12,
    color: "#999999",
  },
  uploadedImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  bankCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: isSmallDevice ? 14 : 16,
  },
  bankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  bankLabel: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#666666",
  },
  bankValue: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: "500",
    color: "#1A3A4A",
  },
  buttonContainer: {
    paddingBottom: isSmallDevice ? 20 : 30,
    marginTop: "auto",
  },
});

export default BankTransfer;
