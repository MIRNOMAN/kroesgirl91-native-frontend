import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";

export default function AggrementScreen() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo at the top */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/register/register.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title and subtitle */}
        <Text style={styles.title}>Non-Disclosure Agreement</Text>
        <Text style={styles.subtitle}>
          Please review and accept before accessing documents
        </Text>

        {/* Warning box */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            <Text style={styles.warningBold}>
              ⚠️ This agreement is legally binding.{" "}
            </Text>
            All documents accessed through this platform are strictly
            confidential
          </Text>
        </View>

        {/* NDA Content */}
        <View style={styles.ndabox}>
          <Text style={styles.ndaSectionTitle}>
            1. Confidential Information
          </Text>
          <Text style={styles.ndaText}>
            All documents, procedures, instructional materials, technical
            specification, and any other information accessed through the
            platform are considered Confidential Information.
          </Text>
          <Text style={styles.ndaSectionTitle}>2. Obligations</Text>
          <Text style={styles.ndaText}>
            The Receiving Party agrees to: (a) hold and maintain the
            Confidential Information in strict confidence; (b) not to disclose,
            publish, or otherwise reveal any of the Confidential Information to
            any third party; (c) not to copy, reproduce, or download any
            documents from the Platform unless explicitly authorized.
          </Text>
          <Text style={styles.ndaSectionTitle}>3. Duration</Text>
          <Text style={styles.ndaText}>
            This Agreement and the obligations herein shall remain in effect for
            a period of five (5) years from the date of acceptance, or until the
            Confidential Information no longer qualifies as confidential,
            whichever is later.
          </Text>
          <Text style={styles.ndaSectionTitle}>4. Remedies</Text>
          <Text style={styles.ndaText}>
            The Receiving Party acknowledges that any breach of this Agreement
            may cause irreparable harm and that monetary damages may be
            inadequate. The Disclosing Party shall be entitled to seek equitable
            relief, including injunction and specific performance.
          </Text>
          <Text style={styles.ndaSectionTitle}>5. Return of Materials</Text>
          <Text style={styles.ndaText}>
            Upon termination or expiration of this Agreement, the Receiving
            Party shall promptly return or destroy all Confidential Information
            and any copies thereof.
          </Text>
        </View>

        {/* Checkbox */}
        <Pressable
          style={styles.checkboxRow}
          onPress={() => setChecked((prev) => !prev)}
        >
          <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read and agree to the Non-Disclosure Agreement and understand
            that all documents on this platform are confidential.
          </Text>
        </Pressable>
      </ScrollView>
      {/* Footer button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.nativeButton, !checked && styles.nativeButtonDisabled]}
          onPress={() => checked && router.replace("/login")}
          disabled={!checked}
        >
          <Text style={styles.nativeButtonText}>Accept & Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: "#FEE2E2",
    borderColor: "#F87171",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    width: "100%",
  },
  warningText: {
    color: "#B91C1C",
    fontSize: 13,
    textAlign: "left",
  },
  warningBold: {
    fontWeight: "bold",
    color: "#B91C1C",
  },
  ndabox: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 18,
  },
  ndaSectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 2,
  },
  ndaText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
    lineHeight: 20,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 18,
    width: "100%",
    gap: 10,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: COLORS.onboardingPrimary,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.onboardingPrimary,
    borderColor: COLORS.onboardingPrimary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: -2,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.onboardingPrimary,
    fontWeight: "500",
    marginTop: 2,
  },
  footer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: COLORS.white,
  },
  nativeButton: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.onboardingPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  nativeButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  nativeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
});
