import React, { useState } from "react";
import {
  View,
  TextInput,
  type TextInputProps,
  Pressable,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { cn } from "@/lib/cn";

export interface InputProps extends TextInputProps {
  className?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  error?: boolean;
}

export function Input({
  className,
  containerClassName,
  leftIcon,
  rightIcon,
  clearable,
  onClear,
  error,
  value,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={cn(
        "flex-row items-center bg-surface border border-border rounded-2xl px-4 h-12 gap-3",
        isFocused && "border-primary bg-white border-2",
        error && "border-danger border-2",
        containerClassName
      )}
    >
      {leftIcon && <View className="items-center justify-center">{leftIcon}</View>}
      <TextInput
        value={value}
        placeholderTextColor="#9CA3AF"
        className={cn(
          "flex-1 font-jakarta text-base text-ink p-0 h-full",
          className
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
      {clearable && value && value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear input"
          onPress={onClear}
          className="p-1 items-center justify-center active:opacity-60"
        >
          <X size={16} color="#6B7280" />
        </Pressable>
      ) : rightIcon ? (
        <View className="items-center justify-center">{rightIcon}</View>
      ) : null}
    </View>
  );
}

export interface SearchInputProps extends Omit<InputProps, "leftIcon"> {
  placeholder?: string;
}

export function SearchInput({
  placeholder = "Search",
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <Input
      placeholder={placeholder}
      leftIcon={<Search size={18} color="#6B7280" />}
      containerClassName={cn("rounded-full h-12 px-5", containerClassName)}
      clearable
      {...props}
    />
  );
}
