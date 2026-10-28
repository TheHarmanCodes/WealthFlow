import React from "react";
import {
  Pressable,
  ActivityIndicator,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";

export interface GradientButtonProps
  extends Omit<PressableProps, "children" | "style"> {
  title: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: StyleProp<ViewStyle>;
  colors?: readonly [string, string, ...string[]];
  onPress?: () => void;
}

export function GradientButton({
  title,
  icon,
  iconPosition = "right",
  loading = false,
  disabled = false,
  size = "md",
  className,
  style,
  colors = ["#6366F1", "#2563EB", "#06B6D4"] as const,
  onPress,
  ...props
}: GradientButtonProps) {
  const isInactive = disabled || loading;

  const sizeClasses = {
    sm: "h-10 px-4 rounded-xl",
    md: "h-12 px-6 rounded-2xl",
    lg: "h-13 sm:h-14 px-7 rounded-2xl",
  }[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      className={cn(
        "overflow-hidden active:opacity-90 active:scale-[0.99]",
        disabled && "opacity-50",
        className
      )}
      style={style}
      {...props}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
        className={cn(
          "flex-row items-center justify-center gap-2 shadow-md shadow-[#6366F1]/30",
          sizeClasses
        )}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            {icon && iconPosition === "left" && <View>{icon}</View>}
            <Text
              style={{ color: "#FFFFFF" }}
              className="font-jakarta-bold text-sm sm:text-base"
            >
              {title}
            </Text>
            {icon && iconPosition === "right" && <View>{icon}</View>}
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}
