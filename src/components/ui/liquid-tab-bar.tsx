import React from "react";
import { View, Pressable } from "react-native";
import { Home, BarChart2, Wallet, User } from "lucide-react-native";
import { cn } from "@/lib/cn";
import { Text } from "./text";

export type TabKey = "home" | "stats" | "wallet" | "profile";
export type TabBarMode = "floating" | "light" | "glass" | "dark";

export interface TabItem {
  key: TabKey;
  label: string;
}

export interface LiquidGlassTabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  mode?: TabBarMode;
  className?: string;
}

const defaultTabs: TabItem[] = [
  { key: "home", label: "Home" },
  { key: "stats", label: "Stats" },
  { key: "wallet", label: "Wallet" },
  { key: "profile", label: "Profile" },
];

export function LiquidGlassTabBar({
  activeTab,
  onTabChange,
  mode = "floating",
  className,
}: LiquidGlassTabBarProps) {
  const isDark = mode === "dark";

  const renderIcon = (key: TabKey, isSelected: boolean) => {
    const iconColor = isSelected
      ? "#FFFFFF"
      : isDark
      ? "#9CA3AF"
      : "#4B5563";

    const size = 20;

    switch (key) {
      case "home":
        return <Home size={size} color={iconColor} />;
      case "stats":
        return <BarChart2 size={size} color={iconColor} />;
      case "wallet":
        return <Wallet size={size} color={iconColor} />;
      case "profile":
        return <User size={size} color={iconColor} />;
    }
  };

  const modeStyles: Record<TabBarMode, string> = {
    floating: "bg-white/90 border-white/80 shadow-floating",
    light: "bg-surface border-border shadow-card",
    glass: "bg-white/70 border-white/80 shadow-glass",
    dark: "bg-surface-dark border-white/10 shadow-raised",
  };

  return (
    <View
      className={cn(
        "h-16 flex-row items-center justify-between px-3 rounded-full border w-full max-w-[340px] self-center",
        modeStyles[mode],
        className
      )}
    >
      {defaultTabs.map((tab) => {
        const isSelected = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onTabChange(tab.key)}
            className={cn(
              "flex-1 items-center justify-center h-12 rounded-full active:opacity-75 transition-colors",
              isSelected && (isDark ? "bg-[#2C2C2E]" : "bg-primary")
            )}
          >
            {renderIcon(tab.key, isSelected)}
            <Text
              variant="caption"
              tone={isSelected ? "inverse" : isDark ? "subtle" : "muted"}
              className={cn(
                "text-[11px] mt-0.5 font-jakarta-medium",
                isSelected && "font-jakarta-semibold text-white"
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
