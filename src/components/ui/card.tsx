import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/cn";

export interface CardProps extends ViewProps {
  variant?: "elevated" | "flat" | "outlined";
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  variant = "flat",
  className,
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    flat: "bg-surface border border-border/60 shadow-card",
    elevated: "bg-surface shadow-raised border border-transparent",
    outlined: "bg-transparent border border-border shadow-none",
  };

  return (
    <View
      className={cn(
        "rounded-card p-4 overflow-hidden",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
