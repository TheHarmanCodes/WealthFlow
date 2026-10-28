import React from "react";
import { View, Pressable, ScrollView, type StyleProp, type ViewStyle } from "react-native";
import { cn } from "@/lib/cn";
import { Text } from "./text";

export interface SegmentOption<T extends string = string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  style,
  scrollable = false,
}: SegmentedControlProps<T>) {
  const content = options.map((option) => {
    const isSelected = option.value === value;

    return (
      <Pressable
        key={option.value}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSelected }}
        onPress={() => onChange(option.value)}
        className={cn(
          "flex-row items-center justify-center rounded-full px-4 h-9 active:opacity-75",
          scrollable ? "min-w-[90px]" : "flex-1",
          isSelected
            ? "bg-primary-soft border border-primary"
            : "bg-surface border border-border"
        )}
      >
        <Text
          variant="subhead"
          tone={isSelected ? "primary" : "muted"}
          className={cn(
            "text-sm font-jakarta-medium",
            isSelected && "font-jakarta-semibold"
          )}
        >
          {option.label}
        </Text>
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        className={className}
        style={style}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View
      accessibilityRole="tablist"
      className={cn("flex-row items-center gap-2 w-full", className)}
      style={style}
    >
      {content}
    </View>
  );
}
