import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { Check } from "lucide-react-native";
import React from "react";
import { Pressable, View, useColorScheme } from "react-native";

export interface CheckboxFieldProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string | React.ReactNode;
  variant?: "inline" | "boxed";
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function CheckboxField({
  checked,
  onCheckedChange,
  label,
  variant = "inline",
  error,
  className,
  disabled = false,
}: CheckboxFieldProps) {
  const isDark = useColorScheme() === "dark";

  const handleToggle = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  const checkboxBox = (
    <View
      style={{
        backgroundColor: checked ? "#2563EB" : isDark ? "#0F172A" : "#FFFFFF",
        borderColor: checked ? "#2563EB" : isDark ? "#334155" : "#CBD5E1",
      }}
      className="w-6 h-6 rounded-sm items-center justify-center border"
    >
      {checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
    </View>
  );

  if (variant === "boxed") {
    return (
      <View className="mb-3 w-full">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled }}
          onPress={handleToggle}
          style={{
            borderColor: error ? "#EF4444" : isDark ? "#1E293B" : "#E2E8F0",
          }}
          className={cn(
            "flex-row items-start p-3.5 sm:p-4 rounded-lg border ",
            className,
          )}
        >
          <View className="mr-3.5 mt-0.5">{checkboxBox}</View>
          <View className="flex-1">
            {typeof label === "string" ? (
              <Text
                style={{ color: isDark ? "#E2E8F0" : "#1E293B" }}
                className="text-xs sm:text-sm font-jakarta leading-relaxed"
              >
                {label}
              </Text>
            ) : (
              label
            )}
          </View>
        </Pressable>
        {error && (
          <Text
            style={{ color: "#EF4444" }}
            className="text-xs font-jakarta mt-1 pl-1"
          >
            {error}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className={className}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
        onPress={handleToggle}
        className="flex-row items-center active:opacity-75"
      >
        {checkboxBox}
        {label && (
          <View className="ml-2.5">
            {typeof label === "string" ? (
              <Text
                style={{ color: isDark ? "#94A3B8" : "#475569" }}
                className="text-xs sm:text-sm font-jakarta"
              >
                {label}
              </Text>
            ) : (
              label
            )}
          </View>
        )}
      </Pressable>
      {error && (
        <Text
          style={{ color: "#EF4444" }}
          className="text-xs font-jakarta mt-1 pl-1"
        >
          {error}
        </Text>
      )}
    </View>
  );
}
