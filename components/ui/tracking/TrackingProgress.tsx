import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface ProgressStep {
  id: number;
  label: string;
  completed: boolean;
}

interface TrackingProgressProps {
  steps: ProgressStep[];
  currentStep?: number;
}

const icons = ["checkmark-circle", "cube", "bicycle", "car", "home"];

export default function TrackingProgress({
  steps,
  currentStep = 0,
}: TrackingProgressProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isActive = index === currentStep;
          const iconColor = isCompleted
            ? "#FFB800"
            : isActive
              ? "#003C52"
              : "#E0E0E0";

          return (
            <View key={step.id} style={styles.stepContainer}>
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isCompleted ? "#FFF5E6" : "#F5F5F5",
                  },
                ]}
              >
                <Ionicons
                  name={icons[index] as any}
                  size={isSmallDevice ? 18 : 22}
                  color={iconColor}
                />
              </View>

              {/* Progress dot and line */}
              <View style={styles.progressDotContainer}>
                <View
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: isCompleted ? "#FFB800" : "#E0E0E0",
                    },
                  ]}
                />
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.progressLine,
                      {
                        backgroundColor: isCompleted ? "#FFB800" : "#E0E0E0",
                      },
                    ]}
                  />
                )}
              </View>

              {/* Label */}
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: isCompleted ? "#003C52" : "#A0A0A0",
                    fontWeight: isCompleted || isActive ? "600" : "400",
                  },
                ]}
                numberOfLines={2}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stepContainer: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: isSmallDevice ? 40 : 48,
    height: isSmallDevice ? 40 : 48,
    borderRadius: isSmallDevice ? 20 : 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  progressDotContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
    justifyContent: "center",
    marginBottom: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  progressLine: {
    position: "absolute",
    left: "50%",
    right: "-50%",
    height: 2,
    zIndex: 0,
  },
  stepLabel: {
    fontSize: isSmallDevice ? 9 : 10,
    textAlign: "center",
    maxWidth: isSmallDevice ? 50 : 60,
    lineHeight: isSmallDevice ? 12 : 14,
  },
});
