import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, ChevronDown, HelpCircle } from "lucide-react-native";

const FAQ_ITEMS = [
  {
    q: "How does Biometric & Face ID Login work?",
    a: "When enabled in Profile → Security & Authentication, WealthFlow prompts for Face ID, Touch ID, or Android Biometrics whenever you open the app or return from the background. Verification runs locally via your device's secure enclave.",
  },
  {
    q: "How is my Primary Currency selected?",
    a: "WealthFlow automatically detects your phone's country and sets your matching local currency by default. You can search and switch to any world currency at any time under Profile → Primary Currency.",
  },
  {
    q: "Can I customize which Push Notifications I receive?",
    a: "Yes. Open Profile → Push Notifications to toggle Unusual Spend Alerts, Budget Threshold Warnings, or the Weekly Wealth Digest individually.",
  },
  {
    q: "Does changing Appearance & Theme affect the whole app?",
    a: "Yes. Choosing Automatic (System), Light, or Dark updates all tabs, sheets, navigation bars, and headers immediately and persists across app restarts.",
  },
  {
    q: "How is my account secured?",
    a: "Your session and credentials are managed through Clerk with optional Authenticator App Two-Factor Authentication (2FA) and local biometric locking.",
  },
];

export default function HelpScreen() {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 16) }}
      className="flex-1 bg-[#F8FAFC] dark:bg-[#080C16]"
    >
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="w-10 h-10 rounded-full bg-white dark:bg-[#16181F] border border-black/[0.08] dark:border-white/[0.12] items-center justify-center"
        >
          <ArrowLeft size={18} color={isDark ? "#FFFFFF" : "#000000"} />
        </Pressable>

        <View className="flex-row items-center gap-2">
          <HelpCircle size={20} color="#007AFF" />
          <Text className="text-[17px] font-jakarta-bold text-black dark:text-white">
            Help Center & FAQs
          </Text>
        </View>

        <View className="w-10 h-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 24) + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-[20px] bg-white dark:bg-[#16181F] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden">
          {FAQ_ITEMS.map((item, idx) => {
            const expanded = openIdx === idx;
            const isLast = idx === FAQ_ITEMS.length - 1;

            return (
              <View
                key={item.q}
                className={
                  !isLast
                    ? "border-b border-black/[0.05] dark:border-white/[0.06]"
                    : ""
                }
              >
                <Pressable
                  onPress={() => setOpenIdx(expanded ? null : idx)}
                  className="flex-row items-center justify-between p-4"
                >
                  <Text className="flex-1 pr-3 text-[15px] font-jakarta-semibold text-black dark:text-white">
                    {item.q}
                  </Text>
                  <View
                    style={{
                      transform: [{ rotate: expanded ? "180deg" : "0deg" }],
                    }}
                  >
                    <ChevronDown size={18} color="#8E8E93" />
                  </View>
                </Pressable>

                {expanded && (
                  <View className="px-4 pb-4">
                    <Text className="text-[13px] font-jakarta-regular text-[#4B5563] dark:text-[#D1D5DB] leading-[20px]">
                      {item.a}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
