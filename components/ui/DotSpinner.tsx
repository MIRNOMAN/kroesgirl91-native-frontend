import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

type DotSpinnerProps = {
  size?: number;
  color?: string;
  speed?: number;
};

export default function DotSpinner({
  size = 32,
  color = "#FFFFFF",
  speed = 200,
}: DotSpinnerProps) {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 9);
    }, speed);

    return () => clearInterval(intervalId);
  }, [speed]);

  const dotCount = 9;
  const radius = size / 2;

  return (
    <View style={[styles.dotSpinner, { width: size, height: size }]}>
      {Array.from({ length: dotCount }).map((_, index) => {
        const angle = (index / dotCount) * 2 * Math.PI;
        const dotSize =
          index === 0
            ? size * 0.28
            : index === 1 || index === 8
              ? size * 0.24
              : size * 0.21;

        const distance = (index - activeDot + dotCount) % dotCount;
        const opacitySteps = [1, 0.8, 0.6, 0.45, 0.35, 0.28, 0.22, 0.18, 0.14];
        const opacity = opacitySteps[distance];

        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                opacity,
                backgroundColor: color,
                left: size / 2,
                top: size / 2,
                transform: [
                  { translateX: Math.cos(angle) * radius - dotSize / 2 },
                  { translateY: Math.sin(angle) * radius - dotSize / 2 },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dotSpinner: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
  },
});
