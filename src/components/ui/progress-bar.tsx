import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/cn";
import { Text } from "./text";

export interface ProgressBarProps {
  progress: number; // 0 to 1 (or 0 to 100)
  colorClassName?: string;
  trackClassName?: string;
  height?: number;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export function ProgressBar({
  progress,
  colorClassName = "bg-primary",
  trackClassName = "bg-border",
  height = 5,
  leftLabel,
  rightLabel,
  className,
}: ProgressBarProps) {
  const normalizedProgress = Math.min(
    100,
    Math.max(0, progress <= 1 ? progress * 100 : progress)
  );

  return (
    <View className={cn("w-full gap-1.5", className)}>
      {(leftLabel || rightLabel) && (
        <View className="flex-row items-center justify-between">
          {leftLabel ? (
            <Text
              variant="caption"
              tone="primary"
              className="font-jakarta-semibold"
            >
              {leftLabel}
            </Text>
          ) : null}
          {rightLabel ? (
            <Text
              variant="caption"
              tone="muted"
              className="font-jakarta-medium"
            >
              {rightLabel}
            </Text>
          ) : null}
        </View>
      )}
      <View
        className={cn("w-full rounded-full overflow-hidden", trackClassName)}
        style={{ height }}
      >
        <View
          className={cn("h-full rounded-full", colorClassName)}
          style={{ width: `${normalizedProgress}%` }}
        />
      </View>
    </View>
  );
}
