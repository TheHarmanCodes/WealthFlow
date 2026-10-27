import React from "react";
import {
  Text as RNText,
  type TextProps as RNTextProps,
  useColorScheme,
} from "react-native";
import { cn } from "@/lib/cn";
import { tones, type Tone } from "./tones";

export const textVariants = {
  display: "font-jakarta-bold text-display tracking-tight",
  heading: "font-jakarta-semibold text-heading",
  title: "font-jakarta-semibold text-title",
  body: "font-jakarta text-body",
  lead: "font-jakarta-medium text-lead",
  subhead: "font-jakarta-medium text-subhead",
  caption: "font-jakarta text-caption",
  footnote: "font-jakarta-medium text-footnote",
  button: "font-jakarta-semibold text-button",
} as const;

export type TextVariant = keyof typeof textVariants;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: Tone;
  className?: string;
};

export function Text({
  variant = "body",
  tone,
  className,
  style,
  ...props
}: TextProps) {
  const isDark = useColorScheme() === "dark";

  // Semantic color adapting directly to active light / dark theme
  const toneColor =
    tone === "muted"
      ? isDark
        ? "#94A3B8"
        : "#6B7280"
      : tone === "subtle"
      ? isDark
        ? "#64748B"
        : "#9CA3AF"
      : tone === "inverse"
      ? isDark
        ? "#0B0B1A"
        : "#FFFFFF"
      : tone === "primary"
      ? "#0A84FF"
      : tone === "accent"
      ? "#BF5AF2"
      : tone === "success"
      ? "#30D158"
      : tone === "danger"
      ? "#FF453A"
      : tone === "warning"
      ? "#FF9F0A"
      : isDark
      ? "#FFFFFF"
      : "#0B0B1A";

  return (
    <RNText
      className={cn(
        textVariants[variant],
        tone ? tones[tone] : isDark ? "text-white" : "text-ink",
        className
      )}
      style={[{ color: toneColor }, style]}
      {...props}
    />
  );
}

// Export ThemedText alias for drop-in compatibility across the app
export const ThemedText = Text;
