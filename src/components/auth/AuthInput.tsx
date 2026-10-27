import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  Pressable,
  TextInput,
  useColorScheme,
  View,
  type TextInputProps,
} from "react-native";

export interface AuthInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerClassName?: string;
}

export function AuthInput({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerClassName,
  className,
  onFocus,
  onBlur,
  secureTextEntry,
  style,
  ...props
}: AuthInputProps) {
  const isDark = useColorScheme() === "dark";
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={cn("w-full mb-3.5", containerClassName)}>
      {label && (
        <Text
          style={{ color: isDark ? "#E2E8F0" : "#1E293B" }}
          className="text-subhead sm:text-caption font-jakarta-medium mb-1 font-bold"
        >
          {label}
        </Text>
      )}

      <View
        style={{
          backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
          borderColor: error
            ? "#EF4444"
            : isFocused
              ? isDark
                ? "#38BDF8"
                : "#0A84FF"
              : isDark
                ? "#1E293B"
                : "#cbd5e1",
          borderWidth: isFocused ? 1 : 0.5,
        }}
        className="flex-row items-center rounded-lg px-3.5 h-12"
      >
        {leftIcon && (
          <View className="mr-2.5 items-center justify-center">{leftIcon}</View>
        )}

        <TextInput
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          style={[{ color: isDark ? "#FFFFFF" : "#0B0B1A" }, style]}
          className={cn(
            "flex-1 font-jakarta text-sm sm:text-base h-full p-0",
            className,
          )}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
            onPress={() => setShowPassword((prev) => !prev)}
            className="p-1 items-center justify-center active:opacity-60"
            hitSlop={8}
          >
            {showPassword ? (
              <EyeOff size={18} color={isDark ? "#94A3B8" : "#64748B"} />
            ) : (
              <Eye size={18} color={isDark ? "#94A3B8" : "#64748B"} />
            )}
          </Pressable>
        ) : (
          rightIcon && (
            <View className="ml-2 items-center justify-center">
              {rightIcon}
            </View>
          )
        )}
      </View>

      {error ? (
        <Text
          style={{ color: "#EF4444" }}
          className="text-xs font-jakarta mt-1 pl-1"
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          style={{ color: isDark ? "#64748B" : "#94A3B8" }}
          className="text-[11px] font-jakarta mt-1 pl-1"
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
