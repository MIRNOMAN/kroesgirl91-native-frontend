import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = step.id <= currentStep;
        const isCompleted = step.id < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      isActive && styles.stepNumberActive,
                    ]}
                  >
                    {step.id}
                  </Text>
                )}
              </View>
            </View>
            {!isLast && (
              <View
                style={[
                  styles.stepLine,
                  isActive && step.id < currentStep && styles.stepLineActive,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: isSmallDevice ? 30 : 40,
    paddingVertical: isSmallDevice ? 15 : 20,
  },
  stepContainer: {
    alignItems: "center",
  },
  stepCircle: {
    width: isSmallDevice ? 28 : 32,
    height: isSmallDevice ? 28 : 32,
    borderRadius: isSmallDevice ? 14 : 16,
    backgroundColor: "#F0F0F0",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: "#F5A623",
    borderColor: "#F5A623",
  },
  stepCircleCompleted: {
    backgroundColor: "#F5A623",
    borderColor: "#F5A623",
  },
  stepNumber: {
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: "600",
    color: "#999999",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLine: {
    width: isSmallDevice ? 40 : 60,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: "#F5A623",
  },
});

export default StepIndicator;
