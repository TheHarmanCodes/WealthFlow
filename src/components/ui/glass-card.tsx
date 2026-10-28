import { cn } from "@/lib/cn";
import {
  GlassView as RNGlassView,
  isGlassEffectAPIAvailable,
} from "expo-glass-effect";
import { styled } from "nativewind";
import React from "react";
import { View, type ViewProps } from "react-native";
const GlassView = styled(RNGlassView, { className: "style" });

export interface GlassCardProps extends ViewProps {
  className?: string;
  contentClassName?: string;
  tint?: "light" | "dark";
  borderGlow?: boolean;
  children?: React.ReactNode;
}

export function GlassCard({
  className,
  contentClassName,
  tint = "light",
  borderGlow = true,
  children,
  style,
  ...props
}: GlassCardProps) {
  const isDark = tint === "dark";
  const glassAvailable = isGlassEffectAPIAvailable();

  return (
    <View
      className={cn(
        "rounded-[28px] overflow-hidden ",
        isDark ? " bg-[#1C1C1E]/90 shadow-raised" : " bg-white/80 shadow-glass",
        borderGlow && (isDark ? "shadow-black/50" : "shadow-primary/15"),
        className,
      )}
      style={style}
      {...props}
    >
      {glassAvailable ? (
        <GlassView
          glassEffectStyle="regular"
          colorScheme={isDark ? "dark" : "light"}
          className={cn("p-6", contentClassName)}
        >
          {children}
        </GlassView>
      ) : (
        <View className={cn("p-6", contentClassName)}>{children}</View>
      )}
    </View>
  );
}
