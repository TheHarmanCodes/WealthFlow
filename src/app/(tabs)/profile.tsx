import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Linking,
  Pressable,
  Switch,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Fingerprint,
  HelpCircle,
  LogOut,
  Palette,
  ScanFace,
  ShieldCheck,
  User,
} from "lucide-react-native";
import { TabScreenWrapper } from "@/components/navigation/tab-screen-wrapper";
import { CurrencyPickerSheet } from "@/components/profile/currency-picker-sheet";
import { NotificationPermissionSheet } from "@/components/profile/notification-permission-sheet";
import { PrivacyPolicyIcon } from "@/components/profile/profile-icons";
import { SecurityInfoSheet } from "@/components/profile/security-info-sheet";
import { ThemePickerSheet } from "@/components/profile/theme-picker-sheet";
import { formatCurrencyBadge, getCurrencyByCode } from "@/constants/currencies";
import {
  BiometricCapabilities,
  getBiometricCapabilities,
  promptBiometricAuth,
} from "@/lib/biometrics";
import {
  PushPermissionState,
  getNotificationPermissionStatus,
  requestNotificationPermission,
} from "@/lib/notifications";
import {
  NotificationChannels,
  clearBiometricGraceWindow,
  usePreferences,
} from "@/lib/preferences";

export default function ProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { prefs, hydrated, update } = usePreferences();

  const [bioCaps, setBioCaps] = useState<BiometricCapabilities>({
    hasHardware: false,
    isEnrolled: false,
    label: "Face ID / Biometrics",
    isFaceId: false,
  });
  const [bioBusy, setBioBusy] = useState(false);

  const [pushState, setPushState] = useState<{
    status: PushPermissionState;
    canAskAgain: boolean;
  }>({ status: "undetermined", canAskAgain: true });

  const [currencySheetOpen, setCurrencySheetOpen] = useState(false);
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const [notifSheetOpen, setNotifSheetOpen] = useState(false);
  const [securitySheetOpen, setSecuritySheetOpen] = useState(false);
  const autoPromptTriggeredRef = useRef(false);

  const refreshSystemStates = useCallback(async () => {
    const [caps, notif] = await Promise.all([
      getBiometricCapabilities(),
      getNotificationPermissionStatus(),
    ]);
    setBioCaps(caps);
    setPushState(notif);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const [caps, notif] = await Promise.all([
        getBiometricCapabilities(),
        getNotificationPermissionStatus(),
      ]);
      if (!active) return;
      setBioCaps(caps);
      setPushState(notif);
    })();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refreshSystemStates();
      }
    });
    return () => {
      active = false;
      sub.remove();
    };
  }, [refreshSystemStates]);

  // First-time creative push notification permission prompt
  useEffect(() => {
    if (!hydrated || autoPromptTriggeredRef.current) return;
    if (
      !prefs.hasSeenNotificationPrompt &&
      pushState.status === "undetermined"
    ) {
      const timer = setTimeout(() => {
        autoPromptTriggeredRef.current = true;
        setNotifSheetOpen(true);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [hydrated, prefs.hasSeenNotificationPrompt, pushState.status]);

  const handleToggleBiometrics = async (nextValue: boolean) => {
    if (bioBusy) return;
    setBioBusy(true);
    try {
      const caps = await getBiometricCapabilities();
      setBioCaps(caps);

      if (nextValue) {
        if (!caps.hasHardware) {
          Alert.alert(
            "Biometrics Unavailable",
            "This device does not support biometric hardware authentication.",
          );
          return;
        }
        if (!caps.isEnrolled) {
          Alert.alert(
            `${caps.label} Not Set Up`,
            `Please enroll ${caps.label} in your device settings first to enable biometric login for WealthFlow.`,
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ],
          );
          return;
        }

        const auth = await promptBiometricAuth({
          promptMessage: "Unlock WealthFlow",
          promptSubtitle: `Verify ${caps.label} to protect WealthFlow`,
        });
        if (!auth.success) return;

        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        await update({ biometricEnabled: true });
      } else {
        if (caps.hasHardware && caps.isEnrolled) {
          const auth = await promptBiometricAuth({
            promptMessage: "Unlock WealthFlow",
            promptSubtitle: `Confirm ${caps.label} to turn off app lock`,
          });
          if (!auth.success) return;
        }
        await update({ biometricEnabled: false });
      }
    } finally {
      setBioBusy(false);
    }
  };

  const handleRequestNotifications = async (): Promise<boolean> => {
    const result = await requestNotificationPermission();
    setPushState(result);
    await update({
      hasSeenNotificationPrompt: true,
      pushEnabled: result.status === "granted",
    });
    return result.status === "granted";
  };

  const handleDismissNotifSheet = async () => {
    setNotifSheetOpen(false);
    if (!prefs.hasSeenNotificationPrompt) {
      await update({ hasSeenNotificationPrompt: true });
    }
  };

  const handleToggleChannel = (
    key: keyof NotificationChannels,
    value: boolean,
  ) => {
    Haptics.selectionAsync().catch(() => {});
    update({
      notificationChannels: {
        ...prefs.notificationChannels,
        [key]: value,
      },
    });
  };

  const handleSignOut = async () => {
    try {
      clearBiometricGraceWindow();
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  const userEmail =
    user?.primaryEmailAddress?.emailAddress ?? "user@wealthflow.app";
  const userName = user?.fullName ?? user?.firstName ?? "WealthFlow Member";
  const avatarUrl = user?.hasImage ? user.imageUrl : null;

  const activeCurrency = getCurrencyByCode(prefs.currencyCode);
  const currencyLabel = formatCurrencyBadge(activeCurrency);

  const themeLabel =
    prefs.themeMode === "system"
      ? `System (${isDark ? "Dark" : "Light"})`
      : prefs.themeMode === "dark"
        ? "Dark"
        : "Light";

  const pushLabel =
    pushState.status === "granted"
      ? prefs.pushEnabled
        ? "On"
        : "Paused"
      : pushState.status === "denied"
        ? "Off"
        : "Allow";

  const iconTint = isDark ? "#FFFFFF" : "#000000";
  const BioIcon = bioCaps.isFaceId ? ScanFace : Fingerprint;

  return (
    <TabScreenWrapper title="Profile">
      {/* Account Info Card */}
      <View
        className="flex-row items-center p-4 rounded-[20px] border mb-6 bg-white dark:bg-[#16181F] border-[#E5E7EB] dark:border-white/[0.08]"
        style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}
      >
        <View className="w-12 h-12 rounded-full bg-[#007AFF]/12 items-center justify-center mr-3.5 overflow-hidden">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 48, height: 48 }}
              contentFit="cover"
            />
          ) : (
            <User size={24} color="#007AFF" />
          )}
        </View>

        <View className="flex-1 pr-2">
          <Text
            numberOfLines={1}
            className="text-[16px] font-jakarta-bold text-black dark:text-white"
          >
            {userName}
          </Text>
          <Text
            numberOfLines={1}
            className="text-[13px] font-jakarta-regular text-[#6B7280] dark:text-[#9CA3AF] mt-0.5"
          >
            {userEmail}
          </Text>
        </View>

        <Pressable
          onPress={() => setCurrencySheetOpen(true)}
          className="px-2.5 py-1 rounded-full bg-[#007AFF]/12"
        >
          <Text className="text-[12px] font-jakarta-bold text-[#007AFF]">
            {activeCurrency.flag} {activeCurrency.code}
          </Text>
        </Pressable>
      </View>

      {/* Security & Authentication */}
      <View className="mb-5">
        <Text className="text-[12px] font-jakarta-semibold uppercase tracking-[0.5px] text-[#6B7280] dark:text-[#9CA3AF] mb-2 pl-1">
          Security & Authentication
        </Text>

        <View className="rounded-[16px] border overflow-hidden bg-white dark:bg-[#16181F] border-[#F1F5F9] dark:border-white/[0.08]">
          {/* Biometric & Face ID Login */}
          <Pressable
            onPress={() => handleToggleBiometrics(!prefs.biometricEnabled)}
            disabled={bioBusy}
            className="flex-row items-center px-3.5 py-3.5"
          >
            <View className="w-7 items-center mr-2.5">
              <BioIcon size={18} color={iconTint} />
            </View>

            <View className="flex-1 pr-2">
              <Text className="text-[14px] font-jakarta-medium text-black dark:text-white">
                Biometric & Face ID Login
              </Text>
              <Text className="text-[11px] font-jakarta-regular text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                {bioCaps.hasHardware
                  ? bioCaps.isEnrolled
                    ? `${bioCaps.label} ${prefs.biometricEnabled ? "protecting app" : "ready"}`
                    : `${bioCaps.label} not enrolled on device`
                  : "Hardware unavailable on this device"}
              </Text>
            </View>

            <Switch
              value={prefs.biometricEnabled}
              onValueChange={handleToggleBiometrics}
              disabled={bioBusy}
              trackColor={{ false: "#D1D5DB", true: "#30D158" }}
            />
          </Pressable>

          <View className="h-[1px] ml-[52px] bg-[#F3F4F6] dark:bg-white/[0.06]" />

          {/* Two-Factor Authentication */}
          <Pressable
            onPress={() => setSecuritySheetOpen(true)}
            className="flex-row items-center px-3.5 py-3.5"
          >
            <View className="w-7 items-center mr-2.5">
              <ShieldCheck size={18} color={iconTint} />
            </View>

            <Text className="flex-1 text-[14px] font-jakarta-medium text-black dark:text-white">
              Two-Factor Authentication
            </Text>

            <Text
              className={`text-[13px] font-jakarta-medium mr-1.5 ${
                user?.twoFactorEnabled
                  ? "text-[#30D158]"
                  : "text-[#6B7280] dark:text-[#9CA3AF]"
              }`}
            >
              {user?.twoFactorEnabled ? "Active" : "Off"}
            </Text>

            <ChevronRight size={16} color="#8E8E93" />
          </Pressable>
        </View>
      </View>

      {/* Preferences */}
      <View className="mb-5">
        <Text className="text-[12px] font-jakarta-semibold uppercase tracking-[0.5px] text-[#6B7280] dark:text-[#9CA3AF] mb-2 pl-1">
          Preferences
        </Text>

        <View className="rounded-[16px] border overflow-hidden bg-white dark:bg-[#16181F] border-[#F1F5F9] dark:border-white/[0.08]">
          {/* Push Notifications */}
          <Pressable
            onPress={() => setNotifSheetOpen(true)}
            className="flex-row items-center px-3.5 py-3.5"
          >
            <View className="w-7 items-center mr-2.5">
              <Bell size={18} color={iconTint} />
            </View>

            <Text className="flex-1 text-[14px] font-jakarta-medium text-black dark:text-white">
              Push Notifications
            </Text>

            <Text
              className={`text-[13px] font-jakarta-regular mr-1.5 ${
                pushState.status === "granted" && prefs.pushEnabled
                  ? "text-[#007AFF] font-jakarta-medium"
                  : "text-[#6B7280] dark:text-[#9CA3AF]"
              }`}
            >
              {pushLabel}
            </Text>

            <ChevronRight size={16} color="#8E8E93" />
          </Pressable>

          <View className="h-[1px] ml-[52px] bg-[#F3F4F6] dark:bg-white/[0.06]" />

          {/* Appearance & Theme */}
          <Pressable
            onPress={() => setThemeSheetOpen(true)}
            className="flex-row items-center px-3.5 py-3.5"
          >
            <View className="w-7 items-center mr-2.5">
              <Palette size={18} color={iconTint} />
            </View>

            <Text className="flex-1 text-[14px] font-jakarta-medium text-black dark:text-white">
              Appearance & Theme
            </Text>

            <Text className="text-[13px] font-jakarta-regular text-[#6B7280] dark:text-[#9CA3AF] mr-1.5">
              {themeLabel}
            </Text>

            <ChevronRight size={16} color="#8E8E93" />
          </Pressable>

          <View className="h-[1px] ml-[52px] bg-[#F3F4F6] dark:bg-white/[0.06]" />

          {/* Primary Currency */}
          <Pressable
            onPress={() => setCurrencySheetOpen(true)}
            className="flex-row items-center px-3.5 py-3.5"
          >
            <View className="w-7 items-center mr-2.5">
              <CreditCard size={18} color={iconTint} />
            </View>

            <Text className="flex-1 text-[14px] font-jakarta-medium text-black dark:text-white">
              Primary Currency
            </Text>

            <Text className="text-[13px] font-jakarta-medium text-[#6B7280] dark:text-[#9CA3AF] mr-1.5">
              {currencyLabel}
            </Text>

            <ChevronRight size={16} color="#8E8E93" />
          </Pressable>
        </View>
      </View>

      {/* Support & Legal */}
      <View className="mb-5">
        <Text className="text-[12px] font-jakarta-semibold uppercase tracking-[0.5px] text-[#6B7280] dark:text-[#9CA3AF] mb-2 pl-1">
          Support & Legal
        </Text>

        <View className="rounded-[16px] border overflow-hidden bg-white dark:bg-[#16181F] border-[#F1F5F9] dark:border-white/[0.08]">
          <Pressable
            onPress={() => router.push("/help")}
            className="flex-row items-center px-3.5 py-3.5"
          >
            <View className="w-7 items-center mr-2.5">
              <HelpCircle size={18} color={iconTint} />
            </View>

            <Text className="flex-1 text-[14px] font-jakarta-medium text-black dark:text-white">
              Help Center & FAQs
            </Text>

            <ChevronRight size={16} color="#8E8E93" />
          </Pressable>

          <View className="h-[1px] ml-[52px] bg-[#F3F4F6] dark:bg-white/[0.06]" />

          <Pressable
            onPress={() => router.push("/legal")}
            className="flex-row items-center px-3.5 py-3.5"
          >
            <View className="w-7 items-center mr-2.5">
              <PrivacyPolicyIcon size={18} color={iconTint} />
            </View>

            <Text className="flex-1 text-[14px] font-jakarta-medium text-black dark:text-white">
              Privacy Policy & Terms
            </Text>

            <ChevronRight size={16} color="#8E8E93" />
          </Pressable>
        </View>
      </View>

      {/* Sign Out Button */}
      <Pressable
        onPress={handleSignOut}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        className="flex-row items-center justify-center gap-2 py-3.5 rounded-[16px] bg-[#FF453A]/10 mt-2 mb-4"
      >
        <LogOut size={18} color="#FF453A" />
        <Text className="text-[#FF453A] text-[15px] font-jakarta-bold">
          Sign Out
        </Text>
      </Pressable>

      {/* Interactive Sheets */}
      <CurrencyPickerSheet
        visible={currencySheetOpen}
        selectedCode={prefs.currencyCode}
        isAutoDetected={prefs.currencyAutoDetected}
        onSelect={(code, isAuto = false) =>
          update({ currencyCode: code, currencyAutoDetected: isAuto })
        }
        onClose={() => setCurrencySheetOpen(false)}
      />

      <ThemePickerSheet
        visible={themeSheetOpen}
        selectedMode={prefs.themeMode}
        onSelect={(themeMode) => update({ themeMode })}
        onClose={() => setThemeSheetOpen(false)}
      />

      <NotificationPermissionSheet
        visible={notifSheetOpen}
        isFirstTimePrompt={!prefs.hasSeenNotificationPrompt}
        permissionState={pushState.status}
        canAskAgain={pushState.canAskAgain}
        currencySymbol={activeCurrency.symbol}
        channels={prefs.notificationChannels}
        pushEnabled={prefs.pushEnabled}
        onToggleChannel={handleToggleChannel}
        onRequestPermission={handleRequestNotifications}
        onDisableInApp={() => update({ pushEnabled: false })}
        onDismiss={handleDismissNotifSheet}
      />

      <SecurityInfoSheet
        visible={securitySheetOpen}
        onClose={() => setSecuritySheetOpen(false)}
      />
    </TabScreenWrapper>
  );
}
