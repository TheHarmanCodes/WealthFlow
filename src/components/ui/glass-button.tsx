import { cn } from "@/lib/cn";
import {
  GlassView as RNGlassView,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";
import React from "react";
import {
  Platform,
  Pressable,
  View,
  useColorScheme,
  type GestureResponderEvent,
  type PressableProps,
} from "react-native";
import { Text } from "./text";

// NativeWind styled wrapper for third-party GlassView on iOS
const GlassView = styled(RNGlassView, { className: "style" });

export interface GlassButtonProps extends Omit<PressableProps, "onPress"> {
  title?: string;
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
  textClassName?: string;
}

export function GlassButton({
  title,
  children,
  onPress,
  disabled,
  className,
  textClassName,
  ...props
}: GlassButtonProps) {
  const isDark = useColorScheme() === "dark";

  // Check iOS Apple native liquid glass capability
  const hasLiquidGlass = Platform.OS === "ios" && isLiquidGlassAvailable();

  const content = children ?? (
    <Text
      variant="body"
      className={cn(
        "font-jakarta-semibold text-[15px] tracking-tight text-ink dark:text-surface text-center z-10",
        textClassName,
      )}
    >
      {title}
    </Text>
  );

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      hitSlop={12}
      className={cn(
        "active:opacity-75 active:scale-[0.97] transition-transform",
        disabled && "opacity-0 pointer-events-none",
      )}
      {...props}
    >
      {hasLiquidGlass ? (
        // iOS 26+ Native Apple Liquid Glass Effect
        <GlassView
          isInteractive
          colorScheme={isDark ? "dark" : "light"}
          className={cn(
            "h-10 justify-center items-center rounded-full px-4 shadow-sm",
            className,
          )}
        >
          {content}
        </GlassView>
      ) : (
        // Android & Web: Multi-layer Liquid Glass (Specular shine, refraction tint, frosted border, prism glow)
        <View
          className={cn(
            "h-10 justify-center items-center rounded-full px-4 relative overflow-hidden",
            "border border-white/70 dark:border-white/20",
            "shadow-sm elevation-2 border-0 shadow-border",
            className,
          )}
        >
          {/* Base frosted glass gradient */}
          <LinearGradient
            colors={
              isDark
                ? [
                    "rgba(255,255,255,0.18)",
                    "rgba(255,255,255,0.06)",
                    "rgba(255,255,255,0.12)",
                  ]
                : [
                    "rgba(255,255,255,0.92)",
                    "rgba(240,246,255,0.78)",
                    "rgba(255,255,255,0.85)",
                  ]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0 rounded-full"
          />

          {/* Liquid refraction tint (subtle soft azure tint like Apple liquid glass) */}
          <LinearGradient
            colors={
              isDark
                ? [
                    "rgba(56,189,248,0.15)",
                    "rgba(192,132,252,0.08)",
                    "transparent",
                  ]
                : [
                    "rgba(186,230,253,0.35)",
                    "rgba(224,231,255,0.25)",
                    "rgba(255,255,255,0.1)",
                  ]
            }
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            className="absolute inset-0 rounded-full"
          />

          {/* Top specular glossy reflection highlight */}
          <View
            pointerEvents="none"
            className="absolute top-[1px] left-[15%] right-[15%] h-[40%] rounded-full bg-white/60 dark:bg-white/25"
          />

          {/* Bottom subtle ambient rim glow */}
          <View
            pointerEvents="none"
            className="absolute bottom-0 inset-x-2 h-[2px] rounded-full bg-white/40 dark:bg-white/10"
          />

          {content}
        </View>
      )}
    </Pressable>
  );
}
