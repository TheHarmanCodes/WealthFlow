import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { Pressable, useColorScheme, View } from "react-native";

interface AuthFooterProps {
  mode: "sign-in" | "sign-up";
  showContactEmail?: boolean;
}

export function AuthFooter({
  mode,
  showContactEmail = false,
}: AuthFooterProps) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  return (
    <View className="items-center mt-5 mb-2 px-2">
      {/* Navigation Switch Link */}
      <View className="flex-row items-center flex-wrap justify-center gap-1.5 mb-2.5">
        {mode === "sign-in" ? (
          <>
            <Text
              style={{ color: isDark ? "#94A3B8" : "#64748B" }}
              className="text-xs sm:text-sm font-jakarta"
            >
              Don&apos;t have an account?
            </Text>
            <Pressable
              onPress={() => router.push("/(auth)/sign-up")}
              hitSlop={8}
            >
              <Text
                style={{ color: "#38BDF8" }}
                className="text-xs sm:text-sm font-jakarta-bold"
              >
                Sign Up
              </Text>
            </Pressable>
            <Text
              style={{ color: isDark ? "#475569" : "#CBD5E1" }}
              className="text-xs sm:text-sm"
            >
              ·
            </Text>
            <Pressable
              onPress={() => router.replace("/onboarding")}
              hitSlop={8}
            >
              <Text
                style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                className="text-xs sm:text-sm font-jakarta"
              >
                ← Back to Home
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text
              style={{ color: isDark ? "#94A3B8" : "#64748B" }}
              className="text-xs sm:text-sm font-jakarta"
            >
              Already have an account?
            </Text>
            <Pressable
              onPress={() => router.push("/(auth)/sign-in")}
              hitSlop={8}
            >
              <Text
                style={{ color: "#38BDF8" }}
                className="text-xs sm:text-sm font-jakarta-bold"
              >
                Sign in
              </Text>
            </Pressable>
            <Text
              style={{ color: isDark ? "#475569" : "#CBD5E1" }}
              className="text-xs sm:text-sm"
            >
              ·
            </Text>
            <Pressable
              onPress={() => router.replace("/onboarding")}
              hitSlop={8}
            >
              <Text
                style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                className="text-xs sm:text-sm font-jakarta"
              >
                Back to Home
              </Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Legal Agreement */}
      <Text
        style={{ color: isDark ? "#64748B" : "#94A3B8" }}
        className="text-[11px] sm:text-xs font-jakarta text-center max-w-[320px] leading-relaxed mb-2"
      >
        {mode === "sign-in" ? "By signing in" : "By creating an account"}, you
        agree to our{" "}
        <Text
          style={{ color: "#38BDF8" }}
          className="text-[11px] sm:text-xs font-jakarta-medium"
        >
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text
          style={{ color: "#38BDF8" }}
          className="text-[11px] sm:text-xs font-jakarta-medium"
        >
          Privacy Policy
        </Text>
      </Text>

      {/* Optional Contact Email */}
      {showContactEmail && (
        <View className="flex-row items-center gap-1.5 mt-1">
          <Mail size={13} color={isDark ? "#64748B" : "#94A3B8"} />
          <Text
            style={{ color: isDark ? "#64748B" : "#94A3B8" }}
            className="text-[11px] sm:text-xs font-jakarta"
          >
            info@wealthflow.io
          </Text>
        </View>
      )}
    </View>
  );
}
