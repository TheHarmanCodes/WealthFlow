import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Check, ChevronLeft, Lock, Mail } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, ScrollView, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ZodError } from "zod";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { GradientButton } from "@/components/auth/GradientButton";
import { OtpInput } from "@/components/auth/OtpInput";
import { Text } from "@/components/ui/text";
import { getClerkErrorMessage } from "@/lib/clerk-error";
import {
  PASSWORD_RULES,
  forgotPasswordStep1Schema,
  forgotPasswordStep2Schema,
  type ForgotPasswordStep1Data,
  type ForgotPasswordStep2Data,
} from "@/lib/auth-validation";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const { signIn, errors: clerkErrors, fetchStatus } = useSignIn();

  const [stage, setStage] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Stage 1: Request Reset Code
  // This function handles the first step of the forgot password flow,
  //  which is requesting a reset code to be sent to the user's email.
  const handleRequestCode = async () => {
    try {
      setFormErrors({});
      setGeneralError(null);
      forgotPasswordStep1Schema.parse({ email });

      setLoading(true);

      const { error: createError } = await signIn.create({
        identifier: email.trim().toLowerCase(),
      });

      if (createError) {
        console.warn("[ForgotPassword] signIn.create error:", createError);
      } else {
        const { error: sendCodeError } =
          await signIn.resetPasswordEmailCode.sendCode();

        if (sendCodeError) {
          console.warn("[ForgotPassword] sendCode error:", sendCodeError);
        }
      }

      // Always proceed to stage 2 with generic wording to prevent account enumeration
      setStage(2);
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((e) => {
          const field = e.path[0] as keyof ForgotPasswordStep1Data;
          if (field && !newErrors[field]) {
            newErrors[field] = e.message;
          }
        });
        setFormErrors(newErrors);
      } else {
        console.warn("[ForgotPassword] unexpected error:", err);
        setStage(2);
      }
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Resend Code
  const handleResendCode = async (): Promise<boolean> => {
    try {
      setGeneralError(null);
      // sending the code again, but we don't want to reveal if the email is valid or not
      const { error } = await signIn.resetPasswordEmailCode.sendCode();
      if (error) {
        console.warn("[ForgotPassword] resendCode error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn("[ForgotPassword] resendCode error:", err);
      return false;
    }
  };

  // Stage 2: Verify Code and Submit New Password
  const handleResetPassword = async () => {
    try {
      setFormErrors({});
      setGeneralError(null);
      forgotPasswordStep2Schema.parse({
        otpCode,
        password,
        confirmPassword,
      });

      setLoading(true);

      // Step A: Verify Code
      const { error: verifyError } =
        await signIn.resetPasswordEmailCode.verifyCode({
          code: otpCode,
        });

      if (verifyError) {
        setGeneralError(
          getClerkErrorMessage(
            verifyError,
            "Invalid or expired verification code.",
          ),
        );
        return;
      }

      // Step B: Submit New Password
      const { error: submitError } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password,
        });

      if (submitError) {
        setGeneralError(
          getClerkErrorMessage(
            submitError,
            "Could not update password. Please ensure it meets security requirements.",
          ),
        );
        return;
      }

      // Step C: Finalize Session and Navigate
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: () => {
            router.replace("/design");
          },
        });
      } else {
        router.replace("/(auth)/sign-in");
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((e) => {
          const field = e.path[0] as keyof ForgotPasswordStep2Data;
          if (field && !newErrors[field]) {
            newErrors[field] = e.message;
          }
        });
        setFormErrors(newErrors);
      } else {
        setGeneralError("Failed to reset password. Please try again.");
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
          paddingBottom: Math.max(insets.bottom, 16) + 20,
          paddingHorizontal: 10,
          flexGrow: 1,
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View
          key="auth-card-forgot-password"
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
            title={stage === 1 ? "Reset Password" : "Set New Password"}
            subtitle={
              stage === 1
                ? "Enter your registered email to receive a recovery code"
                : `If an account exists for ${email}, a recovery code has been sent. Enter the code and your new password`
            }
          />

          {generalError && (
            <View className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <Text className="text-red-500 text-xs font-jakarta text-center">
                {generalError}
              </Text>
            </View>
          )}

          {/* STAGE 1: Email Input */}
          {stage === 1 && (
            <View className="mt-1">
              <AuthInput
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (formErrors.email) {
                    setFormErrors((prev) => {
                      const next = { ...prev };
                      delete next.email;
                      return next;
                    });
                  }
                  if (generalError) setGeneralError(null);
                }}
                leftIcon={
                  <Mail size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                }
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                error={formErrors.email}
              />

              <GradientButton
                title="Send Recovery Code"
                size="lg"
                loading={isFetching}
                onPress={handleRequestCode}
                className="w-full rounded-2xl mt-2 mb-3"
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to sign in"
                onPress={() => router.back()}
                className="flex-row items-center justify-center py-2 active:opacity-60"
              >
                <ChevronLeft size={16} color={isDark ? "#94A3B8" : "#64748B"} />
                <Text
                  style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                  className="text-xs font-jakarta-medium ml-1"
                >
                  Back to Sign In
                </Text>
              </Pressable>
            </View>
          )}

          {/* STAGE 2: OTP & New Password */}
          {stage === 2 && (
            <View className="mt-1">
              <OtpInput
                code={otpCode}
                onChangeCode={(val) => {
                  setOtpCode(val);
                  if (formErrors.otpCode) {
                    setFormErrors((prev) => {
                      const next = { ...prev };
                      delete next.otpCode;
                      return next;
                    });
                  }
                  if (generalError) setGeneralError(null);
                }}
                error={formErrors.otpCode || clerkErrors.fields?.code?.message}
                onResend={handleResendCode}
                cooldownSeconds={60}
              />

              <AuthInput
                label="New Password"
                placeholder="Enter new password"
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (formErrors.password) {
                    setFormErrors((prev) => {
                      const next = { ...prev };
                      delete next.password;
                      return next;
                    });
                  }
                  if (generalError) setGeneralError(null);
                }}
                isPassword
                leftIcon={
                  <Lock size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                }
                autoCapitalize="none"
                error={
                  formErrors.password || clerkErrors.fields?.password?.message
                }
              />

              {/* Real-time Password Rules Checklist (8+ chars) */}
              <View className="mb-3.5 px-0.5">
                <Text
                  style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                  className="text-[11px] font-jakarta-medium mb-1.5"
                >
                  Password requirements:
                </Text>
                <View className="flex-row flex-wrap">
                  {PASSWORD_RULES.map((rule) => {
                    const isValid = rule.validate(password, confirmPassword);
                    return (
                      <View
                        key={rule.id}
                        className="w-1/2 flex-row items-start justify-start pr-1 gap-1 mb-0.5"
                      >
                        <Check
                          size={13}
                          strokeWidth={3}
                          color={
                            isValid ? "#10B981" : isDark ? "#475569" : "#CBD5E1"
                          }
                          style={{ marginTop: 2 }}
                        />
                        <Text
                          style={{
                            color: isValid
                              ? "#10B981"
                              : isDark
                                ? "#64748B"
                                : "#94A3B8",
                          }}
                          className="text-[11px] font-jakarta flex-1"
                        >
                          {rule.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <AuthInput
                label="Confirm Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  if (formErrors.confirmPassword) {
                    setFormErrors((prev) => {
                      const next = { ...prev };
                      delete next.confirmPassword;
                      return next;
                    });
                  }
                  if (generalError) setGeneralError(null);
                }}
                isPassword
                leftIcon={
                  <Lock size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                }
                autoCapitalize="none"
                error={formErrors.confirmPassword}
              />

              <GradientButton
                title="Reset Password & Sign In"
                size="lg"
                loading={isFetching}
                onPress={handleResetPassword}
                className="w-full rounded-2xl mt-2 mb-3"
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to step 1"
                onPress={() => setStage(1)}
                className="flex-row items-center justify-center py-2 active:opacity-60"
              >
                <ChevronLeft size={16} color={isDark ? "#94A3B8" : "#64748B"} />
                <Text
                  style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                  className="text-xs font-jakarta-medium ml-1"
                >
                  Change Email Address
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
