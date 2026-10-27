import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Lock, User } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ZodError } from "zod";

import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { CheckboxField } from "@/components/auth/CheckboxField";
import { GradientButton } from "@/components/auth/GradientButton";
import { Text } from "@/components/ui/text";
import { setMockSignedIn } from "@/lib/auth-mock";
import { signInSchema, type SignInFormData } from "@/lib/auth-validation";

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const [formData, setFormData] = useState<SignInFormData>({
    identifier: "",
    password: "",
    rememberMe: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    field: keyof SignInFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSignIn = async () => {
    try {
      setErrors({});
      signInSchema.parse(formData);

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      await setMockSignedIn(true);
      router.replace("/design");
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof SignInFormData, string>> = {};
        err.issues.forEach((e) => {
          const field = e.path[0] as keyof SignInFormData;
          if (field && !fieldErrors[field]) {
            fieldErrors[field] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "Google" | "Apple") => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await setMockSignedIn(true);
    router.replace("/design");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Password reset instructions will be sent to your registered email address.",
      [{ text: "OK" }],
    );
  };

  return (
    <View
      style={{ backgroundColor: isDark ? "#080C16" : "#F8FAFC" }}
      className="flex-1"
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 12,
          paddingBottom: Math.max(insets.bottom, 16) + 20,
          paddingHorizontal: 10,
          flexGrow: 1,
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card Container */}
        <View
          key="auth-card-signin"
          style={{
            backgroundColor: isDark ? "#0E1526" : "#FFFFFF",
            borderColor: isDark ? "#121d36" : "#E2E8F0",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.35 : 0.08,
            shadowRadius: 20,
            elevation: 6,
          }}
          className="w-full max-w-[460px] self-center p-4 sm:p-7 rounded-2xl border will-change-variable"
        >
          {/* Header */}
          <AuthHeader
            title="Welcome Back"
            subtitle="Sign in to continue to WealthFlow"
          />

          {/* Form */}
          <View className="mt-1">
            <AuthInput
              label="Username or Email"
              placeholder="Enter your username or email"
              value={formData.identifier}
              onChangeText={(val) => handleInputChange("identifier", val)}
              leftIcon={
                <User size={18} color={isDark ? "#94A3B8" : "#64748B"} />
              }
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.identifier}
            />

            <AuthInput
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(val) => handleInputChange("password", val)}
              isPassword
              leftIcon={
                <Lock size={18} color={isDark ? "#94A3B8" : "#64748B"} />
              }
              autoCapitalize="none"
              error={errors.password}
            />

            {/* Options Row */}
            <View className="flex-row items-center justify-between mt-0.5 mb-4">
              <CheckboxField
                checked={formData.rememberMe}
                onCheckedChange={(val) => handleInputChange("rememberMe", val)}
                label="Remember me for 7 days"
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
                onPress={handleForgotPassword}
                hitSlop={8}
              >
                <Text
                  style={{ color: "#38BDF8" }}
                  className="text-xs sm:text-sm font-jakarta-medium"
                >
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* Sign In Button */}
            <GradientButton
              title="Sign In"
              size="lg"
              loading={loading}
              onPress={handleSignIn}
              className="w-full rounded-2xl"
            />

            {/* Social Logins */}
            <AuthSocialButtons
              mode="sign-in"
              onGooglePress={() => handleSocialAuth("Google")}
              onApplePress={() => handleSocialAuth("Apple")}
            />
            {/* Footer */}
            <AuthFooter mode="sign-in" showContactEmail />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
