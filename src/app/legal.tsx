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
import { ArrowLeft } from "lucide-react-native";
import { PrivacyPolicyIcon } from "@/components/profile/profile-icons";
type LegalTab = "privacy" | "terms";

interface LegalSection {
  title: string;
  body: string;
}

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: "1. Information We Collect",
    body: "WealthFlow collects only the information necessary to provide personal expense tracking, budgeting, and account synchronization. This includes your authentication profile (name and email managed securely via Clerk) and the financial entries, categories, wallets, and preferences you voluntarily create within the app.",
  },
  {
    title: "2. Biometric & Face ID Privacy",
    body: "When you enable Biometric & Face ID Login, authentication is performed exclusively on your device using Apple Face ID / Touch ID or Android BiometricPrompt. WealthFlow never accesses, stores, or transmits your facial geometry, fingerprint templates, or device passcode.",
  },
  {
    title: "3. Local Preferences & Currency Localization",
    body: "Your display theme, notification channel selections, and primary currency are stored locally on your device. Country/region locale data is read on-device solely to auto-select an appropriate default currency and is never used for ad tracking or location profiling.",
  },
  {
    title: "4. AI Financial Insights",
    body: "When you interact with WealthFlow AI features, only the aggregated context required to generate spending summaries or budgeting tips is processed. WealthFlow never sells your financial data to third-party advertisers, brokers, or credit agencies.",
  },
  {
    title: "5. Push Notifications",
    body: "Notifications are strictly opt-in. You can grant, pause, or customize spending alerts, budget warnings, and weekly digests at any time from Profile → Push Notifications or your device's system settings.",
  },
  {
    title: "6. Data Export, Retention & Deletion",
    body: "You retain full ownership of your records. You may export statements or request permanent deletion of your account and associated profile data at any time through WealthFlow support.",
  },
];

const TERMS_SECTIONS: LegalSection[] = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account or using WealthFlow, you agree to be bound by these Terms of Service. If you do not agree with any provision, please discontinue use of the application.",
  },
  {
    title: "2. Personal Finance Tool Disclaimer",
    body: "WealthFlow is a personal budgeting, expense tracking, and analytics utility. Insights, AI summaries, and budget alerts are provided for informational purposes only and do not constitute certified financial, tax, investment, or legal advice.",
  },
  {
    title: "3. Account Security & User Responsibility",
    body: "You are responsible for maintaining the confidentiality of your login credentials, two-factor verification methods, and device biometric settings. Notify us promptly if you suspect unauthorized access to your WealthFlow account.",
  },
  {
    title: "4. Acceptable Use",
    body: "You agree not to misuse WealthFlow services, attempt unauthorized access to backend APIs, reverse-engineer proprietary components, or upload unlawful or fraudulent content.",
  },
  {
    title: "5. Service Availability & Updates",
    body: "We continuously improve WealthFlow across iOS and Android. Features may be updated, enhanced, or modified over time. While we strive for uninterrupted reliability, WealthFlow is provided on an 'as-is' and 'as-available' basis.",
  },
  {
    title: "6. Limitation of Liability",
    body: "To the maximum extent permitted by applicable law, WealthFlow and its contributors shall not be liable for indirect, incidental, or consequential damages resulting from financial decisions made using analytics displayed in the app.",
  },
];

export default function LegalScreen() {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LegalTab>("privacy");

  const sections = activeTab === "privacy" ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 16) }}
      className="flex-1 bg-[#F8FAFC] dark:bg-[#080C16]"
    >
      {/* Top Bar */}
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
          <PrivacyPolicyIcon size={20} color="#007AFF" />
          <Text className="text-[17px] font-jakarta-bold text-black dark:text-white">
            Legal & Privacy
          </Text>
        </View>

        <View className="w-10 h-10" />
      </View>

      {/* Segmented Switcher */}
      <View className="px-5 pt-2 pb-3">
        <View className="flex-row p-1 rounded-[14px] bg-black/[0.06] dark:bg-white/[0.08]">
          <Pressable
            onPress={() => setActiveTab("privacy")}
            className={`flex-1 py-2.5 rounded-[11px] items-center ${
              activeTab === "privacy"
                ? "bg-white dark:bg-[#2C2C2E]"
                : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[13px] font-jakarta-bold ${
                activeTab === "privacy"
                  ? "text-[#007AFF]"
                  : "text-[#6B7280] dark:text-[#98989D]"
              }`}
            >
              Privacy Policy
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("terms")}
            className={`flex-1 py-2.5 rounded-[11px] items-center ${
              activeTab === "terms"
                ? "bg-white dark:bg-[#2C2C2E]"
                : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[13px] font-jakarta-bold ${
                activeTab === "terms"
                  ? "text-[#007AFF]"
                  : "text-[#6B7280] dark:text-[#98989D]"
              }`}
            >
              Terms of Service
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 24) + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Meta Banner */}
        <View className="rounded-[20px] p-4 mb-4 bg-white dark:bg-[#16181F] border border-black/[0.06] dark:border-white/[0.08]">
          <Text className="text-[11px] font-jakarta-bold text-[#007AFF] uppercase tracking-[0.6px]">
            WealthFlow Compliance
          </Text>
          <Text className="text-[20px] font-jakarta-bold text-black dark:text-white mt-1">
            {activeTab === "privacy"
              ? "WealthFlow Privacy Policy"
              : "WealthFlow Terms of Service"}
          </Text>
          <Text className="text-[12px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D] mt-1">
            Effective Date: November 2026 · Last Updated: Version 1.0
          </Text>
        </View>

        {/* Formal Policy Sections */}
        <View className="rounded-[20px] bg-white dark:bg-[#16181F] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden">
          {sections.map((section, idx) => {
            const isLast = idx === sections.length - 1;
            return (
              <View
                key={section.title}
                className={`p-4 ${
                  !isLast
                    ? "border-b border-black/[0.05] dark:border-white/[0.06]"
                    : ""
                }`}
              >
                <Text className="text-[15px] font-jakarta-bold text-black dark:text-white mb-1.5">
                  {section.title}
                </Text>
                <Text
                  selectable
                  className="text-[13px] font-jakarta-regular text-[#4B5563] dark:text-[#D1D5DB] leading-[20px]"
                >
                  {section.body}
                </Text>
              </View>
            );
          })}
        </View>

        <Text
          selectable
          className="text-[12px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D] text-center mt-5"
        >
          Questions? Contact privacy@wealthflow.app
        </Text>
      </ScrollView>
    </View>
  );
}
