import { useSignUp } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, ChevronLeft } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ZodError } from "zod";

import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthStepper } from "@/components/auth/AuthStepper";
import { CheckboxField } from "@/components/auth/CheckboxField";
import { GradientButton } from "@/components/auth/GradientButton";
import { OtpInput } from "@/components/auth/OtpInput";
import { Text } from "@/components/ui/text";
import { getClerkErrorMessage } from "@/lib/clerk-error";
import {
  signUpStep3Schema,
  type SignUpStep3FormData,
} from "@/lib/auth-validation";

export default function VerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string }>();
  const isDark = useColorScheme() === "dark";

  const { signUp, errors: clerkErrors, fetchStatus } = useSignUp();

  const email = params.email || "you@example.com";

  const [formData, setFormData] = useState<SignUpStep3FormData>({
    acceptTerms: true,
    acceptPrivacy: true,
    marketingConsent: false,
    otpCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
      },
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const updateField = (
    field: keyof SignUpStep3FormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleResend = async () => {
    try {
      setGeneralError(null);
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) {
        setGeneralError(
          getClerkErrorMessage(
            error,
            "Could not resend code. Please wait a moment.",
          ),
        );
      }
    } catch {
      setGeneralError("Could not resend code. Please try again.");
    }
  };

  const handleComplete = async () => {
    try {
      setErrors({});
      setGeneralError(null);
      signUpStep3Schema.parse(formData);

      setLoading(true);

      const { error } = await signUp.verifications.verifyEmailCode({
        code: formData.otpCode,
      });

      if (error) {
        setGeneralError(
          getClerkErrorMessage(
            error,
            "Invalid or expired verification code.",
          ),
        );
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: () => {
            router.replace("/design");
          },
        });
      } else {
        setGeneralError(`Verification status: ${signUp.status}`);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((e) => {
          const field = e.path[0] as keyof SignUpStep3FormData;
          if (field && !newErrors[field]) {
            newErrors[field] = e.message;
          }
        });
        setErrors(newErrors);
      } else {
        setGeneralError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFetching = loading || fetchStatus === "fetching";

  return (
    <View
      style={{ backgroundColor: isDark ? "#080C16" : "#F8FAFC" }}
      className="flex-1"
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 12,
          paddingBottom: keyboardOpen ? 140 : Math.max(insets.bottom, 16) + 20,
          paddingHorizontal: 10,
          flexGrow: 1,
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View
          key="auth-card-verify"
          style={{
            backgroundColor: isDark ? "#0E1526" : "#FFFFFF",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
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
            title="Final Step & Verification"
            subtitle={`Review agreements and enter the security code sent to ${email}`}
          />

          {generalError && (
            <View className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <Text className="text-red-500 text-xs font-jakarta text-center">
                {generalError}
              </Text>
            </View>
          )}

          {/* Stepper showing step 3 active */}
          <AuthStepper currentStep={3} />

          <View className="mt-1">
            <View nativeID="clerk-captcha" />

            <Text
              style={{ color: isDark ? "#94A3B8" : "#64748B" }}
              className="text-xs font-jakarta-bold tracking-wider mb-3 uppercase"
            >
              Review & Accept
            </Text>

            {/* Terms Checkbox */}
            <CheckboxField
              variant="boxed"
              checked={formData.acceptTerms}
              onCheckedChange={(val) => updateField("acceptTerms", val)}
              error={errors.acceptTerms}
              label={
                <Text
                  style={{ color: isDark ? "#E2E8F0" : "#1E293B" }}
                  className="text-xs sm:text-sm font-jakarta"
                >
                  I accept the{" "}
                  <Text
                    style={{ color: "#38BDF8" }}
                    className="font-jakarta-medium text-sm"
                  >
                    Terms of Service
                  </Text>{" "}
                  <Text style={{ color: "#EF4444" }}>*</Text>
                </Text>
              }
            />

            {/* Privacy Checkbox */}
            <CheckboxField
              variant="boxed"
              checked={formData.acceptPrivacy}
              onCheckedChange={(val) => updateField("acceptPrivacy", val)}
              error={errors.acceptPrivacy}
              label={
                <Text
                  style={{ color: isDark ? "#E2E8F0" : "#1E293B" }}
                  className="text-xs sm:text-sm font-jakarta"
                >
                  I accept the{" "}
                  <Text
                    style={{ color: "#38BDF8" }}
                    className="font-jakarta-medium text-sm"
                  >
                    Privacy Policy
                  </Text>{" "}
                  and acknowledge the collection and processing of my personal
                  data <Text style={{ color: "#EF4444" }}>*</Text>
                </Text>
              }
            />

            {/* Optional */}
            <Text
              style={{ color: isDark ? "#64748B" : "#94A3B8" }}
              className="text-xs font-jakarta mt-1.5 mb-2"
            >
              Optional
            </Text>

            <CheckboxField
              variant="boxed"
              checked={formData.marketingConsent}
              onCheckedChange={(val) => updateField("marketingConsent", val)}
              label={
                <Text
                  style={{ color: isDark ? "#94A3B8" : "#475569" }}
                  className="text-xs sm:text-sm font-jakarta leading-relaxed"
                >
                  I would like to receive marketing communications and product
                  updates from WealthFlow
                </Text>
              }
            />

            {/* Required disclaimer */}
            <Text
              style={{ color: isDark ? "#64748B" : "#94A3B8" }}
              className="text-[11px] italic font-jakarta mb-4 leading-normal"
            >
              * Required fields. You can withdraw your consent at any time
              through your account settings.
            </Text>

            <View
              style={{ backgroundColor: isDark ? "#1E293B" : "#E2E8F0" }}
              className="flex-1 h-[1px] w-full"
            />

            {/* OTP Code */}
            <OtpInput
              code={formData.otpCode}
              onChangeCode={(val) => updateField("otpCode", val)}
              error={errors.otpCode || clerkErrors.fields?.code?.message}
              onResend={handleResend}
              cooldownSeconds={60}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 120);
              }}
            />

            {/* Back & Complete Registration */}
            <View className="flex-row items-center gap-2.5 mt-3 mb-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to sign up"
                onPress={() => router.replace("/(auth)/sign-up")}
                className="flex-row items-center py-2 px-2.5 active:opacity-60"
              >
                <ChevronLeft
                  size={18}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
                <Text
                  style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                  className="text-sm font-jakarta-semibold ml-1"
                >
                  Back
                </Text>
              </Pressable>

              <GradientButton
                title="Complete Registration"
                size="lg"
                icon={<ArrowRight size={18} color="#FFFFFF" />}
                iconPosition="right"
                loading={isFetching}
                onPress={handleComplete}
                className="flex-1 rounded-2xl"
              />
            </View>

            {/* Footer */}
            <AuthFooter mode="sign-up" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
