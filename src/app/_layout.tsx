import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "../../global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});

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
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
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
      <Stack.Screen name="design" />
    </Stack>
  );
}
