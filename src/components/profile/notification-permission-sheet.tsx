import React, { useState } from "react";
import {
  Linking,
  Pressable,
  Switch,
  Text,
  View,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  Bell,
  BellRing,
  PieChart,
  Settings,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react-native";
import { PushPermissionState } from "@/lib/notifications";
import { NotificationChannels } from "@/lib/preferences";
import { AnimatedBottomSheet } from "./animated-bottom-sheet";

interface NotificationPermissionSheetProps {
  visible: boolean;
  isFirstTimePrompt: boolean;
  permissionState: PushPermissionState;
  canAskAgain: boolean;
  currencySymbol: string;
  channels: NotificationChannels;
  pushEnabled: boolean;
  onToggleChannel: (key: keyof NotificationChannels, value: boolean) => void;
  onRequestPermission: () => Promise<boolean>;
  onDisableInApp: () => void;
  onDismiss: () => void;
}

export function NotificationPermissionSheet({
  visible,
  isFirstTimePrompt,
  permissionState,
  canAskAgain,
  currencySymbol,
  channels,
  pushEnabled,
  onToggleChannel,
  onRequestPermission,
  onDisableInApp,
  onDismiss,
}: NotificationPermissionSheetProps) {
  const isDark = useColorScheme() === "dark";
  const [submitting, setSubmitting] = useState(false);

  const isGranted = permissionState === "granted";
  const permanentlyDenied = permissionState === "denied" && !canAskAgain;

  return (
    <AnimatedBottomSheet visible={visible} onClose={onDismiss}>
      {(requestClose) => {
        const handleEnablePress = async () => {
          setSubmitting(true);
          try {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success,
            ).catch(() => {});
            const granted = await onRequestPermission();
            if (granted) {
              requestClose();
            }
          } finally {
            setSubmitting(false);
          }
        };

        return (
          <View className="px-5">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-[11px] bg-[#007AFF]/15 items-center justify-center">
                  <BellRing size={19} color="#007AFF" />
                </View>
                <View>
                  <Text className="text-[19px] font-jakarta-bold text-black dark:text-white tracking-[-0.3px]">
                    {isFirstTimePrompt && !isGranted
                      ? "Stay Ahead of Your Spend"
                      : "Push Notifications"}
                  </Text>
                  <Text className="text-[12px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D]">
                    {isGranted && pushEnabled
                      ? "Active · Smart alerts enabled"
                      : permanentlyDenied
                        ? "Permission blocked in system settings"
                        : "Real-time insights, zero noise"}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => requestClose()}
                accessibilityLabel="Close notification sheet"
                className="w-8 h-8 rounded-full bg-black/[0.07] dark:bg-white/[0.12] items-center justify-center"
              >
                <X size={16} color={isDark ? "#FFFFFF" : "#000000"} />
              </Pressable>
            </View>

            {/* Creative WealthFlow Notification Preview */}
            <View className="rounded-[20px] bg-white dark:bg-[#2C2C2E] p-3.5 mb-4 border border-black/[0.05] dark:border-white/[0.07]">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <View className="w-5 h-5 rounded-[6px] bg-[#007AFF] items-center justify-center">
                    <Bell size={11} color="#FFFFFF" />
                  </View>
                  <Text className="text-[11px] font-jakarta-bold text-[#6B7280] dark:text-[#98989D] tracking-[0.4px]">
                    WEALTHFLOW · NOW
                  </Text>
                </View>
                <Text className="text-[11px] font-jakarta-medium text-[#30D158]">
                  Preview
                </Text>
              </View>
              <Text className="text-[14px] font-jakarta-bold text-black dark:text-white">
                Weekly Wealth Digest Ready
              </Text>
              <Text className="text-[13px] font-jakarta-regular text-[#4B5563] dark:text-[#D1D5DB] mt-0.5 leading-[18px]">
                You spent {currencySymbol}4,280 less than last week and stayed
                under budget across all 4 categories.
              </Text>
            </View>

            {/* Channel Toggles */}
            <View className="rounded-[18px] bg-white dark:bg-[#2C2C2E] overflow-hidden mb-5">
              <View className="flex-row items-center px-4 py-3.5 border-b border-black/[0.05] dark:border-white/[0.07]">
                <View className="w-8 h-8 rounded-[10px] bg-[#FF453A]/12 items-center justify-center mr-3">
                  <ShieldAlert size={16} color="#FF453A" />
                </View>
                <View className="flex-1 pr-3">
                  <Text className="text-[14px] font-jakarta-semibold text-black dark:text-white">
                    Unusual Spend Alerts
                  </Text>
                  <Text className="text-[11px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D]">
                    Instant ping on large or duplicate charges
                  </Text>
                </View>
                <Switch
                  value={channels.spendingAlerts}
                  onValueChange={(v) => onToggleChannel("spendingAlerts", v)}
                  trackColor={{ false: "#D1D5DB", true: "#30D158" }}
                />
              </View>

              <View className="flex-row items-center px-4 py-3.5 border-b border-black/[0.05] dark:border-white/[0.07]">
                <View className="w-8 h-8 rounded-[10px] bg-[#FF9F0A]/12 items-center justify-center mr-3">
                  <PieChart size={16} color="#FF9F0A" />
                </View>
                <View className="flex-1 pr-3">
                  <Text className="text-[14px] font-jakarta-semibold text-black dark:text-white">
                    Budget Threshold Warnings
                  </Text>
                  <Text className="text-[11px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D]">
                    Notify when reaching 80% of a monthly limit
                  </Text>
                </View>
                <Switch
                  value={channels.budgetWarnings}
                  onValueChange={(v) => onToggleChannel("budgetWarnings", v)}
                  trackColor={{ false: "#D1D5DB", true: "#30D158" }}
                />
              </View>

              <View className="flex-row items-center px-4 py-3.5">
                <View className="w-8 h-8 rounded-[10px] bg-[#007AFF]/12 items-center justify-center mr-3">
                  <TrendingUp size={16} color="#007AFF" />
                </View>
                <View className="flex-1 pr-3">
                  <Text className="text-[14px] font-jakarta-semibold text-black dark:text-white">
                    Weekly Wealth Digest
                  </Text>
                  <Text className="text-[11px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D]">
                    Every Sunday cashflow & savings recap
                  </Text>
                </View>
                <Switch
                  value={channels.weeklyDigest}
                  onValueChange={(v) => onToggleChannel("weeklyDigest", v)}
                  trackColor={{ false: "#D1D5DB", true: "#30D158" }}
                />
              </View>
            </View>

            {/* Action Buttons */}
            {permanentlyDenied ? (
              <Pressable
                onPress={() => Linking.openSettings()}
                className="h-[50px] rounded-[16px] bg-[#007AFF] flex-row items-center justify-center gap-2"
              >
                <Settings size={18} color="#FFFFFF" />
                <Text className="text-[15px] font-jakarta-bold text-white">
                  Open Device Settings
                </Text>
              </Pressable>
            ) : isGranted && pushEnabled ? (
              <View className="gap-2.5">
                <Pressable
                  onPress={() => requestClose()}
                  className="h-[50px] rounded-[16px] bg-[#007AFF] items-center justify-center"
                >
                  <Text className="text-[15px] font-jakarta-bold text-white">
                    Done
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    onDisableInApp();
                    requestClose();
                  }}
                  className="h-[44px] rounded-[14px] bg-black/[0.06] dark:bg-white/[0.09] items-center justify-center"
                >
                  <Text className="text-[14px] font-jakarta-semibold text-[#FF453A]">
                    Pause Push Notifications
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="gap-2">
                <Pressable
                  onPress={handleEnablePress}
                  disabled={submitting}
                  className="h-[52px] rounded-[16px] bg-[#007AFF] items-center justify-center"
                >
                  <Text className="text-[15px] font-jakarta-bold text-white">
                    {submitting ? "Requesting Access..." : "Allow Notifications"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => requestClose()}
                  className="h-[42px] items-center justify-center"
                >
                  <Text className="text-[14px] font-jakarta-medium text-[#6B7280] dark:text-[#98989D]">
                    Not Now
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      }}
    </AnimatedBottomSheet>
  );
}
