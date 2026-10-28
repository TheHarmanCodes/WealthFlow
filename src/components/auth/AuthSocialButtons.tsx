import { Text } from "@/components/ui/text";
import { Pressable, useColorScheme, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface AuthSocialButtonsProps {
  mode?: "sign-in" | "sign-up";
  onGooglePress?: () => void;
  onApplePress?: () => void;
}

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

function AppleIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.02-.49 2.64-1.24z"
        fill={color}
      />
    </Svg>
  );
}

export function AuthSocialButtons({
  mode = "sign-up",
  onGooglePress,
  onApplePress,
}: AuthSocialButtonsProps) {
  const isDark = useColorScheme() === "dark";
  const dividerText =
    mode === "sign-in" ? "or continue with" : "or sign up with";
  const actionPrefix = mode === "sign-in" ? "Sign in with" : "Sign up with";

  return (
    <View className="w-full my-3.5">
      {/* Divider */}
      <View className="flex-row items-center my-3.5">
        <View
          style={{ backgroundColor: isDark ? "#1E293B" : "#E2E8F0" }}
          className="flex-1 h-[1px]"
        />
        <Text
          style={{ color: isDark ? "#64748B" : "#94A3B8" }}
          className="px-3 text-xs font-jakarta"
        >
          {dividerText}
        </Text>
        <View
          style={{ backgroundColor: isDark ? "#1E293B" : "#E2E8F0" }}
          className="flex-1 h-[1px]"
        />
      </View>

      {/* Buttons */}
      <View className="gap-2.5">
        {/* Google Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${actionPrefix} Google`}
          onPress={onGooglePress}
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: isDark ? "#334155" : "#E2E8F0",
          }}
          className="w-full h-12 rounded-2xl border flex-row items-center justify-center gap-3 active:opacity-90 shadow-sm"
        >
          <GoogleIcon />
          <Text
            style={{ color: "#0B0B1A" }}
            className="text-sm font-jakarta-semibold"
          >
            {actionPrefix} Google
          </Text>
        </Pressable>

        {/* Apple Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${actionPrefix} Apple`}
          onPress={onApplePress}
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: isDark ? "#334155" : "#E2E8F0",
          }}
          className="w-full h-12 rounded-2xl border flex-row items-center justify-center gap-3 active:opacity-90 shadow-sm"
        >
          <AppleIcon color="#000000" />
          <Text
            style={{ color: "#0B0B1A" }}
            className="text-sm font-jakarta-semibold"
          >
            {actionPrefix} Apple
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
