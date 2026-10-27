import React, { ReactNode } from "react";
import {
  Pressable,
  ActivityIndicator,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { cn } from "@/lib/cn";
import { Text } from "./text";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "icon";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, { container: string; textTone: "inverse" | "ink" | "primary" | "danger"; indicatorColor: string }> = {
  primary: {
    container: "bg-primary border-transparent",
    textTone: "inverse",
    indicatorColor: "#FFFFFF",
  },
  secondary: {
    container: "bg-surface-muted border border-border",
    textTone: "ink",
    indicatorColor: "#0B0B1A",
  },
  outline: {
    container: "bg-transparent border border-border",
    textTone: "ink",
    indicatorColor: "#0B0B1A",
  },
  ghost: {
    container: "bg-transparent border-transparent",
    textTone: "primary",
    indicatorColor: "#0A84FF",
  },
  destructive: {
    container: "bg-danger border-transparent",
    textTone: "inverse",
    indicatorColor: "#FFFFFF",
  },
  icon: {
    container: "bg-primary-soft border-transparent",
    textTone: "primary",
    indicatorColor: "#0A84FF",
  },
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 rounded-xl",
  md: "h-11 px-5 rounded-2xl",
  lg: "h-14 px-7 rounded-2xl",
  icon: "h-11 w-11 p-0 rounded-2xl items-center justify-center",
};

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  accessibilityLabel?: string;
  onPress?: () => void;
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading,
  disabled,
  className,
  style,
  children,
  accessibilityLabel,
  onPress,
  ...props
}: ButtonProps) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  const isInactive = !!(disabled || loading);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title || "Button"}
      accessibilityState={{ disabled: isInactive, busy: !!loading }}
      disabled={isInactive}
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-center gap-2 active:opacity-75 active:scale-[0.98]",
        v.container,
        s,
        disabled && "opacity-45",
        className
      )}
      style={style}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={v.indicatorColor} />
      ) : children ? (
        children
      ) : (
        <>
          {icon && iconPosition === "left" && <View>{icon}</View>}
          {title ? (
            <Text
              variant="button"
              tone={v.textTone}
              className="text-center font-jakarta-semibold"
            >
              {title}
            </Text>
          ) : null}
          {icon && iconPosition === "right" && <View>{icon}</View>}
        </>
      )}
    </Pressable>
  );
}
