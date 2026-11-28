import { ClerkLoaded, ClerkProvider, useAuth, useClerk } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus, View, useColorScheme } from "react-native";
import { BiometricLockOverlay } from "@/components/profile/biometric-lock-overlay";
import { ensureNotificationHandler } from "@/lib/notifications";
import {
  clearBiometricGraceWindow,
  hydratePreferences,
  isWithinBiometricGraceWindow,
  setSessionBiometricUnlocked,
  useBiometricSessionLock,
} from "@/lib/preferences";
import "../../global.css";

WebBrowser.maybeCompleteAuthSession();
ensureNotificationHandler();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.local.\nRun: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.",
  );
}

SplashScreen.preventAutoHideAsync().catch(() => {});

function AuthBiometricGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const { biometricEnabled, isUnlocked, hydrated, setUnlocked } =
    useBiometricSessionLock();
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;

      // Only lock on real background transitions (not iOS Face ID 'inactive' modal)
      // AND respect the Google Pay / Paytm-style grace window right after auth.
      if (
        prev === "background" &&
        nextState === "active" &&
        isSignedIn &&
        biometricEnabled &&
        !isWithinBiometricGraceWindow()
      ) {
        setSessionBiometricUnlocked(false);
      }
    });
    return () => sub.remove();
  }, [isSignedIn, biometricEnabled]);

  const showLock = Boolean(
    isSignedIn && hydrated && biometricEnabled && !isUnlocked,
  );

  const handleSignOutFromLock = async () => {
    try {
      await signOut();
      clearBiometricGraceWindow();
      router.replace("/(auth)/sign-in");
    } catch (e) {
      console.error("Sign out from lock error:", e);
    }
  };

  return (
    <View className="flex-1">
      {children}
      <BiometricLockOverlay
        visible={showLock}
        onUnlock={() => setUnlocked(true)}
        onSignOut={handleSignOutFromLock}
      />
    </View>
  );
}

export default function RootLayout() {
  const isDark = useColorScheme() === "dark";
  const [loaded, error] = useFonts({
    "PlusJakartaSans-Regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  const ready = loaded || !!error;

  useEffect(() => {
    hydratePreferences();
  }, []);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <AuthBiometricGate>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: isDark ? "#080C16" : "#FFFFFF",
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="legal" />
            <Stack.Screen name="help" />
            <Stack.Screen name="design" />
            <Stack.Screen name="sso-callback" />
          </Stack>
        </AuthBiometricGate>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
