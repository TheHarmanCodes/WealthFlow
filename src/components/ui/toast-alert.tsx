import React from "react";
import { View } from "react-native";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react-native";
import { cn } from "@/lib/cn";
import { Text } from "./text";

export type ToastType = "success" | "warning" | "info" | "danger";

export interface ToastAlertProps {
  type?: ToastType;
  message: string;
  className?: string;
}

export function ToastAlert({
  type = "success",
  message,
  className,
}: ToastAlertProps) {
  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          container: "bg-success-soft border-success/30",
          textTone: "success" as const,
          icon: <CheckCircle2 size={20} color="#30D158" />,
        };
      case "warning":
        return {
          container: "bg-warning-soft border-warning/35",
          textTone: "warning" as const,
          icon: <AlertTriangle size={20} color="#FF9F0A" />,
        };
      case "info":
        return {
          container: "bg-primary-soft border-primary/30",
          textTone: "primary" as const,
          icon: <ShieldCheck size={20} color="#0A84FF" />,
        };
      case "danger":
        return {
          container: "bg-danger-soft border-danger/30",
          textTone: "danger" as const,
          icon: <AlertTriangle size={20} color="#FF453A" />,
        };
    }
  };

  const config = getConfig();

  return (
    <View
      className={cn(
        "flex-row items-center px-4 py-3 rounded-2xl border gap-3 w-full",
        config.container,
        className
      )}
    >
      <View className="items-center justify-center">{config.icon}</View>
      <Text
        variant="subhead"
        tone={config.textTone}
        className="font-jakarta-semibold flex-1"
      >
        {message}
      </Text>
    </View>
  );
}
