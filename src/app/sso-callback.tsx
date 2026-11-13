import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SSOCallbackScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.replace("/design");
      } else {
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <View
      style={{ backgroundColor: isDark ? "#080C16" : "#FFFFFF" }}
      className="flex-1 items-center justify-center"
    >
      <ActivityIndicator size="large" color="#0A84FF" />
    </View>
  );
}
