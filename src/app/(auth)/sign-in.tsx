import { useSignIn, useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Lock, User } from "lucide-react-native";
import { useState } from "react";
import {
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
import { getClerkErrorMessage } from "@/lib/clerk-error";
import { signInSchema, type SignInFormData } from "@/lib/auth-validation";

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const { signIn, errors: clerkErrors, fetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [formData, setFormData] = useState<SignInFormData>({
    identifier: "",
    password: "",
    rememberMe: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInFormData, string>>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    field: keyof SignInFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleSignIn = async () => {
    try {
      setErrors({});
      setGeneralError(null);
      signInSchema.parse(formData);

      setLoading(true);

      const { error } = await signIn.password({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      if (error) {
        setGeneralError(
          getClerkErrorMessage(
            error,
            "Invalid credentials. Please check your username/email and password.",
          ),
        );
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: () => {
            router.replace("/design");
          },
        });
      } else {
        setGeneralError(`Additional sign-in verification required: ${signIn.status}`);
      }
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
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "Google" | "Apple") => {
    try {
      setGeneralError(null);
      setLoading(true);
      const strategy = provider === "Google" ? "oauth_google" : "oauth_apple";
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/design");
      }
    } catch (err: any) {
      console.warn(`[SSO] ${provider} error:`, err);
      setGeneralError(`Unable to complete ${provider} sign-in. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const isFetching = loading || fetchStatus === "fetching";

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

          {generalError && (
            <View className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <Text className="text-red-500 text-xs font-jakarta text-center">
                {generalError}
              </Text>
            </View>
          )}

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
              error={errors.identifier || clerkErrors.fields?.identifier?.message}
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
              error={errors.password || clerkErrors.fields?.password?.message}
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
              loading={isFetching}
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
