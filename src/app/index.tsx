import { getMockSignedIn } from "@/lib/auth-mock";
import { hasSeenOnboarding } from "@/lib/onboarding";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<
    "/design" | "/onboarding" | "/(auth)/sign-in"
  >("/onboarding");

  useEffect(() => {
    Promise.all([getMockSignedIn(), hasSeenOnboarding()]).then(
      ([signedIn, seen]) => {
        setTarget(
          signedIn ? "/design" : seen ? "/(auth)/sign-in" : "/onboarding",
        );
        setLoading(false);
      },
    );
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#0A84FF" size="large" />
      </View>
    );
  }

  return <Redirect href={target} />;
}
