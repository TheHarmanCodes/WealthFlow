import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { getMockSignedIn } from "@/lib/auth-mock";

// Anchor route: when user opens the app or is signed out, sends them to onboarding.
// If signed in, redirects to the main app (/design).
export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    getMockSignedIn().then((signedIn) => {
      setIsSignedIn(signedIn);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#0A84FF" size="large" />
      </View>
    );
  }

  return <Redirect href={isSignedIn ? "/design" : "/onboarding"} />;
}
