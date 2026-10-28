import React from "react";
import { View, Pressable } from "react-native";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui/text";
import { CategoryIconBadge, type CategoryTheme } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";

export interface TransactionItemProps {
  icon: React.ReactNode;
  theme?: CategoryTheme;
  title: string;
  subtitle?: string;
  amount: string;
  isIncome?: boolean;
  timestamp?: string;
  progress?: {
    value: number; // 0 to 100
    leftLabel?: string;
    rightLabel?: string;
  };
  className?: string;
  onPress?: () => void;
}

export function TransactionItem({
  icon,
  theme = "blue",
  title,
  subtitle,
  amount,
  isIncome = false,
  timestamp,
  progress,
  className,
  onPress,
}: TransactionItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        "bg-surface rounded-2xl p-4 border border-border/50 shadow-card active:opacity-85 active:scale-[0.99] gap-3",
        className
      )}
    >
      <View className="flex-row items-center gap-3">
        <CategoryIconBadge icon={icon} theme={theme} size={42} />

        <View className="flex-1 justify-center">
          <Text variant="title" tone="ink" className="text-base font-jakarta-semibold">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" tone="muted" className="mt-0.5 font-jakarta">
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View className="items-end justify-center">
          <Text
            variant="title"
            tone={isIncome ? "success" : "danger"}
            className="text-base font-jakarta-bold"
          >
            {amount}
          </Text>
          {timestamp ? (
            <Text variant="caption" tone="muted" className="mt-0.5 text-[11px] font-jakarta">
              {timestamp}
            </Text>
          ) : null}
        </View>
      </View>

      {progress ? (
        <View className="pt-2 border-t border-border/40">
          <ProgressBar
            progress={progress.value}
            leftLabel={progress.leftLabel}
            rightLabel={progress.rightLabel}
            height={4}
          />
        </View>
      ) : null}
    </Pressable>
  );
}
