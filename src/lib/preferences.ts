import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Appearance, Platform } from "react-native";
import { detectDeviceCurrency } from "@/constants/currencies";

export type ThemePreference = "system" | "light" | "dark";

export interface NotificationChannels {
  spendingAlerts: boolean;
  budgetWarnings: boolean;
  weeklyDigest: boolean;
}

export interface UserPreferences {
  biometricEnabled: boolean;
  themeMode: ThemePreference;
  currencyCode: string;
  currencyAutoDetected: boolean;
  pushEnabled: boolean;
  hasSeenNotificationPrompt: boolean;
  notificationChannels: NotificationChannels;
}

/**
 * Fintech/UPI-style grace window (Google Pay / Paytm pattern):
 * If the user unlocked recently and immediately closes & reopens the app,
 * do not re-prompt until this grace duration has elapsed.
 */
export const BIOMETRIC_UNLOCK_GRACE_MS = 60_000;

const PREFS_KEY = "wealthflow_preferences_v1";
const BIOMETRIC_SECURE_KEY = "wealthflow_biometric_lock_v1";
const BIOMETRIC_LAST_UNLOCK_KEY = "wealthflow_biometric_last_unlock_v1";

function createDefaultPreferences(): UserPreferences {
  const detected = detectDeviceCurrency();
  return {
    biometricEnabled: false,
    themeMode: "system",
    currencyCode: detected.currency.code,
    currencyAutoDetected: true,
    pushEnabled: false,
    hasSeenNotificationPrompt: false,
    notificationChannels: {
      spendingAlerts: true,
      budgetWarnings: true,
      weeklyDigest: true,
    },
  };
}

let currentPrefs: UserPreferences = createDefaultPreferences();
let hydrated = false;
let hydratePromise: Promise<UserPreferences> | null = null;
let sessionBiometricUnlocked = false;
let lastUnlockedAtMs = 0;

type PrefListener = (prefs: UserPreferences) => void;
const listeners = new Set<PrefListener>();

type LockListener = (unlocked: boolean) => void;
const lockListeners = new Set<LockListener>();

function notifyPrefs() {
  listeners.forEach((fn) => {
    try {
      fn(currentPrefs);
    } catch (e) {
      console.warn("[Preferences] Listener error:", e);
    }
  });
}

function notifyLock() {
  lockListeners.forEach((fn) => {
    try {
      fn(sessionBiometricUnlocked);
    } catch (e) {
      console.warn("[BiometricLock] Listener error:", e);
    }
  });
}

export function applyThemePreference(mode: ThemePreference): void {
  try {
    Appearance.setColorScheme(mode === "system" ? "unspecified" : mode);
  } catch (e) {
    console.warn("[Preferences] Unable to update color scheme:", e);
  }
}

async function readSecureItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function writeSecureItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.warn(`[Preferences] Failed to persist ${key}:`, e);
  }
}

export function isWithinBiometricGraceWindow(
  timestampMs = lastUnlockedAtMs,
): boolean {
  return timestampMs > 0 && Date.now() - timestampMs < BIOMETRIC_UNLOCK_GRACE_MS;
}

export async function hydratePreferences(): Promise<UserPreferences> {
  if (hydrated) return currentPrefs;
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    const defaults = createDefaultPreferences();
    try {
      const [rawPrefs, bioRaw, lastUnlockRaw] = await Promise.all([
        AsyncStorage.getItem(PREFS_KEY),
        readSecureItem(BIOMETRIC_SECURE_KEY),
        readSecureItem(BIOMETRIC_LAST_UNLOCK_KEY),
      ]);

      const parsed = rawPrefs
        ? (JSON.parse(rawPrefs) as Partial<UserPreferences>)
        : {};
      const bioEnabled = bioRaw === "true";
      const parsedLastUnlock = lastUnlockRaw ? Number(lastUnlockRaw) : 0;
      lastUnlockedAtMs = Number.isFinite(parsedLastUnlock)
        ? parsedLastUnlock
        : 0;

      currentPrefs = {
        ...defaults,
        ...parsed,
        biometricEnabled: bioEnabled,
        notificationChannels: {
          ...defaults.notificationChannels,
          ...(parsed.notificationChannels ?? {}),
        },
      };

      applyThemePreference(currentPrefs.themeMode);

      if (!currentPrefs.biometricEnabled) {
        sessionBiometricUnlocked = true;
      } else {
        sessionBiometricUnlocked =
          isWithinBiometricGraceWindow(lastUnlockedAtMs);
      }
    } catch (e) {
      console.warn("[Preferences] Failed to hydrate:", e);
      currentPrefs = defaults;
    } finally {
      hydrated = true;
      notifyPrefs();
      notifyLock();
    }
    return currentPrefs;
  })();

  return hydratePromise;
}

export async function updatePreferences(
  patch: Partial<UserPreferences>,
): Promise<UserPreferences> {
  if (!hydrated) {
    await hydratePreferences();
  }

  const next: UserPreferences = {
    ...currentPrefs,
    ...patch,
    notificationChannels: {
      ...currentPrefs.notificationChannels,
      ...(patch.notificationChannels ?? {}),
    },
  };

  if (patch.themeMode && patch.themeMode !== currentPrefs.themeMode) {
    applyThemePreference(patch.themeMode);
  }

  if (typeof patch.biometricEnabled === "boolean") {
    await writeSecureItem(
      BIOMETRIC_SECURE_KEY,
      patch.biometricEnabled ? "true" : "false",
    );
    if (patch.biometricEnabled) {
      lastUnlockedAtMs = Date.now();
      void writeSecureItem(
        BIOMETRIC_LAST_UNLOCK_KEY,
        String(lastUnlockedAtMs),
      );
    } else {
      lastUnlockedAtMs = 0;
      void writeSecureItem(BIOMETRIC_LAST_UNLOCK_KEY, "0");
    }
    sessionBiometricUnlocked = true;
    notifyLock();
  }

  currentPrefs = next;
  notifyPrefs();

  try {
    const serializable = {
      themeMode: next.themeMode,
      currencyCode: next.currencyCode,
      currencyAutoDetected: next.currencyAutoDetected,
      pushEnabled: next.pushEnabled,
      hasSeenNotificationPrompt: next.hasSeenNotificationPrompt,
      notificationChannels: next.notificationChannels,
    };
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(serializable));
  } catch (e) {
    console.warn("[Preferences] Failed to save preferences:", e);
  }

  return currentPrefs;
}

export function setSessionBiometricUnlocked(unlocked: boolean): void {
  if (unlocked) {
    lastUnlockedAtMs = Date.now();
    void writeSecureItem(BIOMETRIC_LAST_UNLOCK_KEY, String(lastUnlockedAtMs));
  }
  if (sessionBiometricUnlocked === unlocked) return;
  sessionBiometricUnlocked = unlocked;
  notifyLock();
}

export function clearBiometricGraceWindow(): void {
  lastUnlockedAtMs = 0;
  void writeSecureItem(BIOMETRIC_LAST_UNLOCK_KEY, "0");
  sessionBiometricUnlocked = false;
  notifyLock();
}

export function getSessionBiometricUnlocked(): boolean {
  return sessionBiometricUnlocked;
}

export function usePreferences(): {
  prefs: UserPreferences;
  hydrated: boolean;
  update: (patch: Partial<UserPreferences>) => Promise<UserPreferences>;
} {
  const [prefs, setPrefs] = useState<UserPreferences>(currentPrefs);
  const [isReady, setIsReady] = useState<boolean>(hydrated);

  useEffect(() => {
    function onChange(next: UserPreferences) {
      setPrefs(next);
      setIsReady(true);
    }
    listeners.add(onChange);

    if (!hydrated) {
      hydratePreferences().then((loaded) => {
        setPrefs(loaded);
        setIsReady(true);
      });
    }

    return () => {
      listeners.delete(onChange);
    };
  }, []);

  return { prefs, hydrated: isReady, update: updatePreferences };
}

export function useBiometricSessionLock(): {
  biometricEnabled: boolean;
  isUnlocked: boolean;
  hydrated: boolean;
  setUnlocked: (unlocked: boolean) => void;
} {
  const { prefs, hydrated: isReady } = usePreferences();
  const [isUnlocked, setIsUnlocked] = useState<boolean>(
    sessionBiometricUnlocked,
  );

  useEffect(() => {
    function onLockChange(next: boolean) {
      setIsUnlocked(next);
    }
    lockListeners.add(onLockChange);
    return () => {
      lockListeners.delete(onLockChange);
    };
  }, []);

  return {
    biometricEnabled: prefs.biometricEnabled,
    isUnlocked,
    hydrated: isReady,
    setUnlocked: setSessionBiometricUnlocked,
  };
}
