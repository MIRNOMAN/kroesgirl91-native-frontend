import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { TrackingStep } from "./types";

type TrackingProgressProps = {
  steps: TrackingStep[];
};

export default function TrackingProgress({ steps }: TrackingProgressProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <View key={step.key} style={styles.stepColumn}>
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.node,
                  step.completed ? styles.nodeActive : styles.nodeInactive,
                ]}
              >
                {step.completed ? (
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                ) : null}
              </View>

              {!isLast ? (
                <View
                  style={[
                    styles.connector,
                    step.completed
                      ? styles.connectorActive
                      : styles.connectorInactive,
                  ]}
                />
              ) : null}
            </View>

            <Text
              style={[
                styles.label,
                step.completed ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  stepColumn: {
    flex: 1,
    alignItems: "center",
  },
  stepRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  node: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  nodeActive: {
    backgroundColor: "#0F4C5C",
  },
  nodeInactive: {
    backgroundColor: "#D7E4E8",
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 6,
    borderRadius: 999,
  },
  connectorActive: {
    backgroundColor: "#0F4C5C",
  },
  connectorInactive: {
    backgroundColor: "#D7E4E8",
  },
  label: {
    marginTop: 8,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  labelActive: {
    color: "#0F172A",
    fontWeight: "700",
  },
  labelInactive: {
    color: "#94A3B8",
    fontWeight: "500",
  },
});
