import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { TabScreenWrapper } from "@/components/navigation/tab-screen-wrapper";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import {
  User,
  Shield,
  Bell,
  Palette,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react-native";

export default function ProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  const userEmail =
    user?.primaryEmailAddress?.emailAddress ?? "user@wealthflow.app";
  const userName =
    user?.fullName ?? user?.firstName ?? "WealthFlow Member";

  interface SettingItem {
    label: string;
    icon: any;
    extra?: string;
  }

  const settingsGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: "Security & Authentication",
      items: [
        { label: "Biometric & Face ID Login", icon: Shield, extra: "Enabled" },
        { label: "Two-Factor Authentication", icon: Shield, extra: "Active" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { label: "Push & Transaction Notifications", icon: Bell, extra: "On" },
        { label: "Appearance & Theme", icon: Palette, extra: isDark ? "Dark" : "Light" },
        { label: "Primary Currency", icon: CreditCard, extra: "USD ($)" },
      ],
    },
    {
      title: "Support & Legal",
      items: [
        { label: "Help Center & FAQs", icon: HelpCircle },
        { label: "Privacy Policy & Terms", icon: Sparkles },
      ],
    },
  ];

  return (
    <TabScreenWrapper title="Profile">
      {/* Account Info Card */}
      <View
        style={[
          styles.accountCard,
          {
            backgroundColor: isDark ? "#16181F" : "#FFFFFF",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB",
          },
        ]}
      >
        <View style={styles.avatarFallback}>
          <User size={24} color="#007AFF" />
        </View>

        <View style={styles.accountText}>
          <Text
            style={[
              styles.userNameText,
              { color: isDark ? "#FFFFFF" : "#000000" },
            ]}
          >
            {userName}
          </Text>
          <Text
            style={[
              styles.userEmailText,
              { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            {userEmail}
          </Text>
        </View>
      </View>

      {/* Settings Sections */}
      {settingsGroups.map((group, gIdx) => (
        <View key={gIdx} style={styles.groupContainer}>
          <Text
            style={[
              styles.groupTitle,
              { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            {group.title}
          </Text>

          <View
            style={[
              styles.groupCard,
              {
                backgroundColor: isDark ? "#16181F" : "#FFFFFF",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
              },
            ]}
          >
            {group.items.map((item, iIdx) => {
              const Icon = item.icon;
              const isLast = iIdx === group.items.length - 1;
              return (
                <View key={iIdx}>
                  <View style={styles.settingRow}>
                    <View style={styles.settingIconWrap}>
                      <Icon
                        size={18}
                        color={isDark ? "#FFFFFF" : "#000000"}
                      />
                    </View>

                    <Text
                      style={[
                        styles.settingLabel,
                        { color: isDark ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {item.label}
                    </Text>

                    {item.extra && (
                      <Text
                        style={[
                          styles.settingExtra,
                          { color: isDark ? "#9CA3AF" : "#6B7280" },
                        ]}
                      >
                        {item.extra}
                      </Text>
                    )}

                    <ChevronRight size={16} color="#8E8E93" />
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.rowDivider,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "#F3F4F6",
                        },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}

      {/* Sign Out Button */}
      <Pressable
        style={styles.signOutButton}
        onPress={handleSignOut}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        <LogOut size={18} color="#FF453A" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    elevation: 2,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 122, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  accountText: {
    flex: 1,
  },
  userNameText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
  },
  userEmailText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 2,
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingLeft: 4,
  },
  groupCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  settingIconWrap: {
    width: 28,
    alignItems: "center",
    marginRight: 10,
  },
  settingLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
  },
  settingExtra: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    marginRight: 6,
  },
  rowDivider: {
    height: 1,
    marginLeft: 52,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255, 69, 58, 0.10)",
    marginTop: 8,
    marginBottom: 16,
  },
  signOutText: {
    color: "#FF453A",
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Bold",
  },
});
