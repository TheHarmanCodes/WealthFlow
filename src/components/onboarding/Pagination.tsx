import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useReducedMotion,
  type SharedValue,
} from "react-native-reanimated";

export interface PaginationProps {
  scrollX: SharedValue<number>;
  count: number;
  itemWidth: number;
  className?: string;
}

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
  shouldReduceMotion: boolean;
}

function Dot({ index, scrollX, itemWidth, shouldReduceMotion }: DotProps) {
  const inputRange = [
    (index - 1) * itemWidth,
    index * itemWidth,
    (index + 1) * itemWidth,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    if (shouldReduceMotion) {
      const active = Math.round(scrollX.value / itemWidth) === index;
      return {
        width: active ? 16 : 7,
        opacity: active ? 1 : 0.35,
        backgroundColor: active ? "#0A84FF" : "#CBD5E1",
      };
    }

    const width = interpolate(
      scrollX.value,
      inputRange,
      [7, 18, 7],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.35, 1, 0.35],
      Extrapolation.CLAMP
    );

    return {
      width,
      opacity,
      backgroundColor: "#0A84FF",
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="h-[7px] rounded-full mx-1"
    />
  );
}

export function Pagination({
  scrollX,
  count,
  itemWidth,
  className,
}: PaginationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <View
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step dots indicator`}
      className={`flex-row items-center justify-center py-4 ${className ?? ""}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Dot
          key={`dot-${index}`}
          index={index}
          scrollX={scrollX}
          itemWidth={itemWidth}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </View>
  );
}
