import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function AuthLayout() {
  const isDark = useColorScheme() === "dark";
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Redirect href="/design" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
        contentStyle: {
          backgroundColor: isDark ? "#080C16" : "#F8FAFC",
        },
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify" />
    </Stack>
  );
}
