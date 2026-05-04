import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import backgroundImage from "../../assets/backround/Photoroom.png";
import { COLORS } from "../../constants/colors";

const WHATSAPP_NUMBER = "5977568415";
const WHATSAPP_MESSAGE = "Hi, I want to request a bulk/business delivery.";

export default function BusinessBulkScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const iconCardSize = Math.min(Math.max(width * 0.34, 236), 230);
  const iconSize = Math.min(Math.max(width * 0.13, 84), 96);
  const buttonBottomPadding = Math.min(Math.max(height * 0.025, 14), 24);

  const openWhatsApp = async () => {
    try {
      const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
      const appUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
      const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      const canOpenApp = await Linking.canOpenURL(appUrl);
      const targetUrl = canOpenApp ? appUrl : webUrl;

      await Linking.openURL(targetUrl);
    } catch {
      Alert.alert("Unable to open WhatsApp", "Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={COLORS.textPrimary}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Business/Bulk</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ImageBackground
          source={backgroundImage}
          style={styles.content}
          imageStyle={styles.backgroundImage}
          resizeMode="cover"
        >
          <View
            style={[
              styles.iconCard,
              { width: iconCardSize, height: iconCardSize },
            ]}
          >
            <View>
              <Image
                source={require("../../assets/Custom_icons/whatsappIcons.png")}
                style={[{ width: iconSize, height: iconSize }]}
              />
            </View>

            <Text style={styles.infoText}>
              For bulk inquiries (5+ items),{"\n"}
              please contact us on WhatsApp.
            </Text>
          </View>
        </ImageBackground>

        <View style={[styles.footer, { paddingBottom: buttonBottomPadding }]}>
          <Pressable style={styles.whatsappButton} onPress={openWhatsApp}>
            <Text style={styles.whatsappButtonText}>Go to WhatsApp</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 19,
    paddingVertical: 22,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerPlaceholder: {
    width: 36,
    height: 36,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backgroundImage: {
    opacity: 0.25,
  },
  iconCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 12,
  },
  iconCircle: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8ECEF",
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 18,
    color: "#4A4A4A",
    fontWeight: "500",
    maxWidth: 190,
  },
  footer: {
    paddingHorizontal: 19,
    backgroundColor: "#F8F9FA",
  },
  whatsappButton: {
    backgroundColor: "#0B3A4C",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  whatsappButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
