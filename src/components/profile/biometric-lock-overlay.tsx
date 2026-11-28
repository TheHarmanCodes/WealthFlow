import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Lock } from "lucide-react-native";
import {
  getBiometricCapabilities,
  promptBiometricAuth,
} from "@/lib/biometrics";

const WEALTHFLOW_LOGO = require("@/assets/images/wealthflow_logo.png");

interface BiometricLockOverlayProps {
  visible: boolean;
  onUnlock: () => void;
  onSignOut: () => void;
}

export function BiometricLockOverlay({
  visible,
  onUnlock,
  onSignOut,
}: BiometricLockOverlayProps) {
  const insets = useSafeAreaInsets();
  const [promptActive, setPromptActive] = useState(true);
  const [promptSubtext, setPromptSubtext] = useState(
    "Verify your identity to access your finances",
  );
  const [errorNote, setErrorNote] = useState<string | null>(null);
  const promptingRef = useRef(false);

  const attemptUnlock = useCallback(async () => {
    if (promptingRef.current) return;
    promptingRef.current = true;
    setPromptActive(true);
    setErrorNote(null);

    try {
      const caps = await getBiometricCapabilities();

      if (!caps.hasHardware || !caps.isEnrolled) {
        onUnlock();
        return;
      }

      const subtitle = `Confirm with ${caps.label} or your device passcode`;
      setPromptSubtext(subtitle);

      const result = await promptBiometricAuth({
        promptMessage: "Unlock WealthFlow",
        promptSubtitle: subtitle,
      });

      if (result.success) {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        onUnlock();
      } else {
        setPromptActive(false);
        if (
          result.error !== "user_cancel" &&
          result.error !== "system_cancel" &&
          result.error !== "app_cancel"
        ) {
          setErrorNote("Verification did not complete. Tap Unlock to retry.");
        }
      }
    } finally {
      promptingRef.current = false;
    }
  }, [onUnlock]);

  useEffect(() => {
    if (visible) {
      attemptUnlock();
    }
  }, [visible, attemptUnlock]);

  const handleCancelPress = () => {
    if (process.env.EXPO_OS === "android") {
      BackHandler.exitApp();
      return;
    }
    // iOS apps cannot programmatically exit without terminating harshly;
    // keep the lock card cleanly displayed.
    Haptics.selectionAsync().catch(() => {});
  };

  if (!visible) return null;

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}
      className={
        promptActive
          ? "flex-1 items-center justify-center px-8 bg-white dark:bg-[#080C16]"
          : "flex-1 items-center justify-center px-6 bg-[#7A7A7A] dark:bg-[#05070D]"
      }
    >
      {promptActive ? (
        /* Screen behind the active OS Biometric / Face ID dialog — clean, zero spinner */
        <View className="items-center max-w-[300px]">
          <Image
            source={WEALTHFLOW_LOGO}
            style={{ width: 64, height: 64 }}
            contentFit="contain"
            accessibilityLabel="WealthFlow Logo"
          />

          <Text className="text-[22px] font-jakarta-bold text-black dark:text-white text-center mt-5 tracking-[-0.4px]">
            Unlock WealthFlow
          </Text>

          <Text className="text-[13px] leading-[19px] font-jakarta-regular text-[#6B7280] dark:text-[#9CA3AF] text-center mt-1.5">
            {promptSubtext}
          </Text>
        </View>
      ) : (
        /* Locked state after cancel/dismiss — Google Pay–style dialog card */
        <>
          <View
            style={{
              borderCurve: "continuous",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)",
            }}
            className="w-full max-w-[320px] rounded-[28px] px-6 pt-7 pb-5 bg-[#F2F4F8] dark:bg-[#1C1E26]"
          >
            <View className="items-center">
              <Lock size={22} color="#007AFF" strokeWidth={2.2} />

              <Text className="text-[21px] font-jakarta-semibold text-[#111827] dark:text-white text-center mt-3.5 tracking-[-0.3px]">
                WealthFlow is locked
              </Text>

              <Text className="text-[13px] leading-[19px] font-jakarta-regular text-[#4B5563] dark:text-[#9CA3AF] text-start mt-2.5">
                For your security, you can only use WealthFlow when it’s
                unlocked
              </Text>

              {errorNote && (
                <Text className="text-[12px] font-jakarta-medium text-[#FF453A] text-center mt-2">
                  {errorNote}
                </Text>
              )}
            </View>

            <View className="flex-row items-center justify-end gap-6 mt-6 pr-1">
              <Pressable
                onPress={handleCancelPress}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Cancel and exit WealthFlow"
                className="py-1.5 px-2"
              >
                <Text className="text-[14px] font-jakarta-semibold text-[#007AFF]">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={attemptUnlock}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Unlock WealthFlow"
                className="py-1.5 px-2"
              >
                <Text className="text-[14px] font-jakarta-semibold text-[#007AFF]">
                  Unlock
                </Text>
              </Pressable>
            </View>
          </View>

          {process.env.EXPO_OS === "ios" && (
            <Pressable onPress={onSignOut} hitSlop={8} className="mt-5 py-1.5">
              <Text className="text-[13px] font-jakarta-medium text-white/80">
                Sign out instead
              </Text>
            </Pressable>
          )}

          {/* Subtle bottom wordmark matching reference */}
          <View
            pointerEvents="none"
            style={{ bottom: Math.max(insets.bottom, 20) + 14 }}
            className="absolute left-0 right-0 items-center"
          >
            <Text className="text-[22px] font-jakarta-bold text-black/35 dark:text-white/30 tracking-[-0.5px]">
              WealthFlow
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
