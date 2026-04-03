import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

type SpinnerProps = {
  size?: number;
  color?: string;
  duration?: number;
};

export default function CustomSpinner({
  size = 60,
  color = "#FFFFFF",
  duration = 800,
}: SpinnerProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [duration, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const dotCount = 8;
  const radius = size / 2.6;

  const dots = Array.from({ length: dotCount }).map((_, index) => {
    const angle = (index / dotCount) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const progress = index / (dotCount - 1);
    const dotSize = size * 0.18 * (1 - progress * 0.55);
    const opacity = 1 - progress * 0.85;

    return (
      <View
        key={index}
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
            opacity,
            transform: [{ translateX: x }, { translateY: y }],
          },
        ]}
      />
    );
  });

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Animated.View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate }],
        }}
      >
        {dots}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
  },
});
