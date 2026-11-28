import React from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import { Check, Moon, Smartphone, Sun, X } from "lucide-react-native";
import { ThemePreference } from "@/lib/preferences";
import { AnimatedBottomSheet } from "./animated-bottom-sheet";

interface ThemePickerSheetProps {
  visible: boolean;
  selectedMode: ThemePreference;
  onSelect: (mode: ThemePreference) => void;
  onClose: () => void;
}

const THEME_OPTIONS: {
  id: ThemePreference;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}[] = [
  {
    id: "system",
    title: "Automatic (System)",
    subtitle: "Follows your device Light & Dark settings",
    Icon: Smartphone,
  },
  {
    id: "light",
    title: "Light",
    subtitle: "Clean daylight surfaces and crisp contrast",
    Icon: Sun,
  },
  {
    id: "dark",
    title: "Dark",
    subtitle: "OLED-friendly obsidian surfaces for low light",
    Icon: Moon,
  },
];

export function ThemePickerSheet({
  visible,
  selectedMode,
  onSelect,
  onClose,
}: ThemePickerSheetProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <AnimatedBottomSheet visible={visible} onClose={onClose}>
      {(requestClose) => (
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-[20px] font-jakarta-bold text-black dark:text-white tracking-[-0.3px]">
                Appearance & Theme
              </Text>
              <Text className="text-[12px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D] mt-0.5">
                Customize how WealthFlow looks on your screen
              </Text>
            </View>

            <Pressable
              onPress={() => requestClose()}
              accessibilityLabel="Close theme picker"
              className="w-8 h-8 rounded-full bg-black/[0.07] dark:bg-white/[0.12] items-center justify-center"
            >
              <X size={16} color={isDark ? "#FFFFFF" : "#000000"} />
            </Pressable>
          </View>

          <View className="rounded-[18px] overflow-hidden bg-white dark:bg-[#2C2C2E]">
            {THEME_OPTIONS.map((option, idx) => {
              const isSelected = option.id === selectedMode;
              const Icon = option.Icon;
              const isLast = idx === THEME_OPTIONS.length - 1;

              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    onSelect(option.id);
                    requestClose();
                  }}
                  className={`flex-row items-center px-4 py-4 ${
                    !isLast
                      ? "border-b border-black/[0.05] dark:border-white/[0.07]"
                      : ""
                  }`}
                >
                  <View
                    className={`w-10 h-10 rounded-[12px] items-center justify-center mr-3.5 ${
                      isSelected
                        ? "bg-[#007AFF]/15"
                        : "bg-black/[0.05] dark:bg-white/[0.08]"
                    }`}
                  >
                    <Icon
                      size={19}
                      color={
                        isSelected
                          ? "#007AFF"
                          : isDark
                            ? "#FFFFFF"
                            : "#000000"
                      }
                    />
                  </View>

                  <View className="flex-1 pr-2">
                    <Text className="text-[15px] font-jakarta-semibold text-black dark:text-white">
                      {option.title}
                    </Text>
                    <Text className="text-[12px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D] mt-0.5">
                      {option.subtitle}
                    </Text>
                  </View>

                  {isSelected && (
                    <View className="w-6 h-6 rounded-full bg-[#007AFF] items-center justify-center">
                      <Check size={14} color="#FFFFFF" strokeWidth={2.8} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </AnimatedBottomSheet>
  );
}
