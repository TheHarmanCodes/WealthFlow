import { useAuth } from "@clerk/expo";
import { hasSeenOnboarding } from "@/lib/onboarding";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [seenOnboarding, setSeenOnboarding] = useState(false);

  useEffect(() => {
    hasSeenOnboarding().then((seen) => {
      setSeenOnboarding(seen);
      setCheckingOnboarding(false);
    });
  }, []);

  if (!isLoaded || checkingOnboarding) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#0A84FF" size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/design" />;
  }

  if (seenOnboarding) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/onboarding" />;
}
