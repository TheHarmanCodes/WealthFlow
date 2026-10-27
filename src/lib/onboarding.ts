import AsyncStorage from "@react-native-async-storage/async-storage";

export const ONBOARDING_STORAGE_KEY = "onboarding_v1_completed";

let memoryHasSeen: boolean | null = null;
type OnboardingListener = (hasSeen: boolean) => void;
const listeners = new Set<OnboardingListener>();

function notify(hasSeen: boolean) {
  listeners.forEach((listener) => {
    try {
      listener(hasSeen);
    } catch (e) {
      console.warn("[Onboarding] Listener error:", e);
    }
  });
}

/**
 * Checks whether the user has completed or skipped the onboarding flow.
 * Wrapped in try/catch: if reading fails, defaults to false (not seen).
 */
export async function hasSeenOnboarding(): Promise<boolean> {
  if (memoryHasSeen !== null) {
    return memoryHasSeen;
  }
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    memoryHasSeen = value === "true";
    return memoryHasSeen;
  } catch (error) {
    console.warn("[Onboarding] Error reading onboarding state:", error);
    memoryHasSeen = false;
    return false;
  }
}

/**
 * Marks onboarding as completed in persistent storage.
 */
export async function completeOnboarding(): Promise<void> {
  memoryHasSeen = true;
  notify(true);
  try {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
  } catch (error) {
    console.warn("[Onboarding] Error persisting onboarding completion:", error);
  }
}

/**
 * Resets onboarding status back to false (for dev & testing purposes only).
 */
export async function resetOnboarding(): Promise<void> {
  memoryHasSeen = false;
  notify(false);
  try {
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.warn("[Onboarding] Error resetting onboarding state:", error);
  }
}

/**
 * Subscribe to live onboarding state changes across the app.
 */
export function subscribeOnboarding(listener: OnboardingListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

