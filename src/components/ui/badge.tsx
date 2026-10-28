import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/cn";
import { Text } from "./text";

export type CategoryTheme =
  | "blue"
  | "green"
  | "purple"
  | "red"
  | "orange"
  | "teal"
  | "gray";

export interface CategoryIconBadgeProps {
  icon: React.ReactNode;
  theme?: CategoryTheme;
  size?: number;
  className?: string;
}

const themeStyles: Record<CategoryTheme, { bg: string; textTone: "primary" | "success" | "danger" | "warning" | "accent" | "muted" }> = {
  blue: { bg: "bg-primary-soft", textTone: "primary" },
  green: { bg: "bg-success-soft", textTone: "success" },
  purple: { bg: "bg-secondary-soft", textTone: "accent" },
  red: { bg: "bg-danger-soft", textTone: "danger" },
  orange: { bg: "bg-warning-soft", textTone: "warning" },
  teal: { bg: "bg-[#E6F8F7]", textTone: "primary" },
  gray: { bg: "bg-surface-muted", textTone: "muted" },
};

export function CategoryIconBadge({
  icon,
  theme = "blue",
  size = 44,
  className,
}: CategoryIconBadgeProps) {
  const currentTheme = themeStyles[theme] || themeStyles.blue;

  return (
    <View
      className={cn(
        "items-center justify-center rounded-2xl",
        currentTheme.bg,
        className
      )}
      style={{ width: size, height: size }}
    >
      {icon}
    </View>
  );
}

export interface PillBadgeProps {
  label: string;
  theme?: CategoryTheme;
  icon?: React.ReactNode;
  className?: string;
}

export function PillBadge({
  label,
  theme = "blue",
  icon,
  className,
}: PillBadgeProps) {
  const currentTheme = themeStyles[theme] || themeStyles.blue;

  return (
    <View
      className={cn(
        "flex-row items-center px-3 py-1 rounded-full gap-1.5",
        currentTheme.bg,
        className
      )}
    >
      {icon && <View>{icon}</View>}
      <Text
        variant="caption"
        tone={currentTheme.textTone}
        className="font-jakarta-semibold"
      >
        {label}
      </Text>
    </View>
  );
}
