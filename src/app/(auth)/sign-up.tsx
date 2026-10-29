import { useSignUp, useSSO } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  Mail,
  User,
} from "lucide-react-native";
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
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { AuthStepper } from "@/components/auth/AuthStepper";
import { CheckboxField } from "@/components/auth/CheckboxField";
import { GradientButton } from "@/components/auth/GradientButton";
import { OtpInput } from "@/components/auth/OtpInput";
import { Text } from "@/components/ui/text";
import { getClerkErrorMessage } from "@/lib/clerk-error";
import {
  PASSWORD_RULES,
  initialSignUpState,
  signUpStep1Schema,
  signUpStep2Schema,
  signUpStep3Schema,
  type SignUpState,
  type SignUpStep1FormData,
  type SignUpStep2FormData,
  type SignUpStep3FormData,
} from "@/lib/auth-validation";

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ step?: string; email?: string }>();
  const isDark = useColorScheme() === "dark";

  const { signUp, errors: clerkErrors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(() => {
    const s = params.step ? parseInt(params.step, 10) : 1;
    return s === 2 || s === 3 ? (s as 1 | 2 | 3) : 1;
  });

  const [formData, setFormData] = useState<SignUpState>({
    ...initialSignUpState,
    email: params.email || "",
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
        if (currentStep === 3) {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
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
  }, [currentStep]);

  useEffect(() => {
    // Scroll to top when changing steps
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentStep]);

  const updateField = (field: keyof SignUpState, value: string | boolean) => {
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

  // Step 1 Validation & Proceed
  const handleStep1Next = () => {
    try {
      setErrors({});
      setGeneralError(null);
      signUpStep1Schema.parse({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
      });
      setCurrentStep(2);
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((e) => {
          const field = e.path[0] as keyof SignUpStep1FormData;
          if (field && !newErrors[field]) {
            newErrors[field] = e.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  // Step 2 Validation & Proceed to Clerk Registration
  const handleStep2Next = async () => {
    try {
      setErrors({});
      setGeneralError(null);
      signUpStep2Schema.parse({
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setLoading(true);

      // Create sign-up attempt with Clerk
      const { error } = await signUp.password({
        emailAddress: formData.email.trim().toLowerCase(),
        password: formData.password,
        username: formData.username.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });

      if (error) {
        setGeneralError(
          getClerkErrorMessage(
            error,
            "Unable to create account. Please check your details.",
          ),
        );
        return;
      }

      // Send 6-digit email verification code
      const { error: sendCodeError } =
        await signUp.verifications.sendEmailCode();

      if (sendCodeError) {
        setGeneralError(
          getClerkErrorMessage(
            sendCodeError,
            "Account created, but failed to send verification code. Please resend.",
          ),
        );
      }

      setCurrentStep(3);
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((e) => {
          const field = e.path[0] as keyof SignUpStep2FormData;
          if (field && !newErrors[field]) {
            newErrors[field] = e.message;
          }
        });
        setErrors(newErrors);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend code in Step 3
  const handleResendCode = async () => {
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

  // Step 3 Completion & Submit
  const handleStep3Complete = async () => {
    try {
      setErrors({});
      setGeneralError(null);
      signUpStep3Schema.parse({
        acceptTerms: formData.acceptTerms,
        acceptPrivacy: formData.acceptPrivacy,
        marketingConsent: formData.marketingConsent,
        otpCode: formData.otpCode,
      });

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
        setGeneralError(`Verification status: ${signUp.status}. Additional steps may be required.`);
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
      setGeneralError(`Unable to complete ${provider} sign-up. Please try again.`);
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
          justifyContent:
            currentStep === 3 || keyboardOpen ? "flex-start" : "center",
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card Container */}
        <View
          key="auth-card-signup"
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
            title={
              currentStep === 3 ? "Final Step & Verification" : "Create Account"
            }
            subtitle={
              currentStep === 3
                ? `Review agreements and enter the security code sent to ${
                    formData.email || "you@example.com"
                  }`
                : "Start managing your finances with WealthFlow"
            }
          />

          {generalError && (
            <View className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <Text className="text-red-500 text-xs font-jakarta text-center">
                {generalError}
              </Text>
            </View>
          )}

          {/* Stepper */}
          {currentStep !== 3 && <AuthStepper currentStep={currentStep} />}

          {/* ============================================================ */}
          {/* STEP 1: ACCOUNT DETAILS                                      */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <View className="mt-0">
              <View className="mb-3.5 w-full">
                <Text
                  style={{ color: isDark ? "#FFFFFF" : "#0B0B1A" }}
                  className="text-base text-center sm:text-lg font-jakarta-bold"
                >
                  Let&apos;s create your account
                </Text>
                <Text
                  style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                  className="text-xs text-center font-jakarta mt-0.5"
                >
                  Enter your basic information
                </Text>
              </View>

              {/* First Name & Last Name (2 columns) */}
              <View className="flex-row gap-2.5">
                <View className="flex-1">
                  <AuthInput
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChangeText={(val) => updateField("firstName", val)}
                    error={errors.firstName || clerkErrors.fields?.firstName?.message}
                  />
                </View>
                <View className="flex-1">
                  <AuthInput
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChangeText={(val) => updateField("lastName", val)}
                    error={errors.lastName || clerkErrors.fields?.lastName?.message}
                  />
                </View>
              </View>

              {/* Username */}
              <AuthInput
                label="Username"
                placeholder="Choose a username"
                value={formData.username}
                onChangeText={(val) => updateField("username", val)}
                leftIcon={
                  <User size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                }
                helperText="3-30 characters: letters, numbers, dots, underscores, hyphens"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.username || clerkErrors.fields?.username?.message}
              />

              {/* Email Address */}
              <AuthInput
                label="Email Address"
                placeholder="you@example.com"
                value={formData.email}
                onChangeText={(val) => updateField("email", val)}
                leftIcon={
                  <Mail size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email || clerkErrors.fields?.emailAddress?.message}
              />

              {/* Social Login Buttons */}
              <AuthSocialButtons
                mode="sign-up"
                onGooglePress={() => handleSocialAuth("Google")}
                onApplePress={() => handleSocialAuth("Apple")}
              />

              {/* Next Button */}
              <View className="items-end mt-2 mb-2">
                <GradientButton
                  title="Next"
                  size="md"
                  icon={<ChevronRight size={18} color="#FFFFFF" />}
                  iconPosition="right"
                  onPress={handleStep1Next}
                  className="min-w-[120px] rounded-2xl"
                />
              </View>

              {/* Footer Switch */}
              <AuthFooter mode="sign-up" />
            </View>
          )}

          {/* ============================================================ */}
          {/* STEP 2: SECURITY                                             */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <View>
              <View className="mb-3.5">
                <Text
                  style={{ color: isDark ? "#FFFFFF" : "#0B0B1A" }}
                  className="text-base font-jakarta-bold text-center"
                >
                  Secure your account
                </Text>
                <Text
                  style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                  className="text-xs font-jakarta mt-0.5 text-center"
                >
                  Create a strong password to protect your financial data
                </Text>
              </View>

              {/* Password Input */}
              <AuthInput
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChangeText={(val) => updateField("password", val)}
                isPassword
                leftIcon={
                  <Lock size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                }
                autoCapitalize="none"
                error={errors.password || clerkErrors.fields?.password?.message}
              />

              {/* Password Requirements Checklist Card (8+ chars) */}
              <View
                style={{
                  backgroundColor: isDark ? "#0A0F1D" : "#F8FAFC",
                  borderColor: isDark ? "#1E293B" : "#E2E8F0",
                }}
                className="p-3 rounded-xl border mb-3.5 mt-0.5"
              >
                <Text
                  style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                  className="text-xs font-jakarta-bold mb-2 uppercase tracking-wide"
                >
                  Password Requirements
                </Text>

                <View className="flex-row flex-wrap">
                  {PASSWORD_RULES.map((rule) => {
                    const isValid = rule.validate(
                      formData.password,
                      formData.confirmPassword,
                    );

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
                          className="text-[11px] sm:text-xs font-jakarta flex-1"
                        >
                          {rule.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Confirm Password Input */}
              <AuthInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(val) => updateField("confirmPassword", val)}
                isPassword
                leftIcon={
                  <Lock size={18} color={isDark ? "#94A3B8" : "#64748B"} />
                }
                autoCapitalize="none"
                error={errors.confirmPassword}
              />

              {/* Back & Next Navigation */}
              <View className="flex-row items-center justify-between mt-3 mb-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Back to Step 1"
                  onPress={() => setCurrentStep(1)}
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
                  title="Next"
                  size="md"
                  icon={<ChevronRight size={18} color="#FFFFFF" />}
                  iconPosition="right"
                  loading={isFetching}
                  onPress={handleStep2Next}
                  className="min-w-[120px] rounded-2xl"
                />
              </View>

              {/* Footer Switch */}
              <AuthFooter mode="sign-up" />
            </View>
          )}

          {/* ============================================================ */}
          {/* STEP 3: FINAL STEP & VERIFICATION                           */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <View className="mt-1">
              {/* Bot Protection mount point */}
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
                onResend={handleResendCode}
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
                  accessibilityLabel="Back to Step 2"
                  onPress={() => setCurrentStep(2)}
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
                  onPress={handleStep3Complete}
                  className="flex-1 rounded-2xl"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
