import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useSession, useUser } from "@clerk/expo";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  MailCheck,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { ToastAlert } from "@/components/ui/toast-alert";
import { downloadBackupCodesPdf } from "@/lib/backup-codes-pdf";
import { getClerkErrorMessage } from "@/lib/clerk-error";
import { AnimatedBottomSheet } from "./animated-bottom-sheet";

interface SecurityInfoSheetProps {
  visible: boolean;
  onClose: () => void;
}

type PendingAction = "enable" | "disable" | "backup_codes" | null;
type ReverifyMethod = "email_code" | "password" | null;

function isReverificationError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as {
    status?: number;
    code?: string;
    errors?: { code?: string; message?: string }[];
  };
  const code = e.code ?? e.errors?.[0]?.code ?? "";
  return (
    code === "session_reverification_required" ||
    code.includes("reverification") ||
    e.status === 403
  );
}

export function SecurityInfoSheet({ visible, onClose }: SecurityInfoSheetProps) {
  const isDark = useColorScheme() === "dark";
  const { user } = useUser();
  const { session } = useSession();

  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [copiedTarget, setCopiedTarget] = useState<"key" | "codes" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clerk session reverification inline state
  const [reverifyMethod, setReverifyMethod] = useState<ReverifyMethod>(null);
  const [reverifyInput, setReverifyInput] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const is2faEnabled = !!user?.twoFactorEnabled;
  const email = user?.primaryEmailAddress?.emailAddress ?? "Signed-in account";
  const accountName = user?.fullName ?? user?.firstName ?? null;

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (
    message: string,
    target: "key" | "codes" | null = null,
  ) => {
    setCopiedTarget(target);
    setToastMessage(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setCopiedTarget(null);
      setToastMessage(null);
    }, 2400);
  };

  const handleCopySecret = async () => {
    if (!totpSecret) return;
    await Clipboard.setStringAsync(totpSecret);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    showToast("Setup key copied to clipboard", "key");
  };

  const handleCopyBackupCodes = async () => {
    if (!backupCodes?.length) return;
    const formatted = backupCodes
      .map((c, idx) => `${String(idx + 1).padStart(2, "0")}. ${c}`)
      .join("\n");
    await Clipboard.setStringAsync(
      `WealthFlow 2FA Backup Codes (${email})\n\n${formatted}`,
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    showToast("Backup codes copied to clipboard", "codes");
  };

  const handleDownloadPdf = async () => {
    if (!backupCodes?.length || downloadingPdf) return;
    setDownloadingPdf(true);
    setErrorMsg(null);
    try {
      await downloadBackupCodesPdf({
        codes: backupCodes,
        accountEmail: email,
        accountName,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
      showToast("WealthFlow backup codes PDF ready");
    } catch (err) {
      setErrorMsg(getClerkErrorMessage(err, "Unable to export PDF right now."));
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleClose = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setCopiedTarget(null);
    setToastMessage(null);
    setFeedback(null);
    setErrorMsg(null);
    setCode("");
    setTotpSecret(null);
    setTotpUri(null);
    setBackupCodes(null);
    setReverifyMethod(null);
    setReverifyInput("");
    setPendingAction(null);
    onClose();
  };

  const beginReverification = async (action: PendingAction) => {
    if (!session) {
      setErrorMsg("No active session found. Please sign in again.");
      return;
    }
    try {
      const verification = await session.startVerification({
        level: "first_factor",
      });
      if (verification.status === "complete") {
        if (action === "enable") await runCreateTotp(false);
        if (action === "disable") await runDisableTotp(false);
        if (action === "backup_codes") await runCreateBackupCodes(false);
        return;
      }

      const emailFactor = verification.supportedFirstFactors?.find(
        (f) => f.strategy === "email_code",
      );
      const hasPassword = verification.supportedFirstFactors?.some(
        (f) => f.strategy === "password",
      );

      setPendingAction(action);
      setReverifyInput("");

      if (emailFactor && "emailAddressId" in emailFactor) {
        await session.prepareFirstFactorVerification({
          strategy: "email_code",
          emailAddressId: emailFactor.emailAddressId,
        });
        setReverifyMethod("email_code");
        setFeedback(`Enter the verification code sent to ${email}.`);
      } else if (hasPassword) {
        setReverifyMethod("password");
        setFeedback("Confirm your account password to continue.");
      } else {
        setErrorMsg(
          "Please sign out and sign back in to refresh your security session before updating 2FA.",
        );
      }
    } catch (err) {
      setErrorMsg(getClerkErrorMessage(err));
    }
  };

  const runCreateTotp = async (allowReverify = true) => {
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);
    setFeedback(null);
    setBackupCodes(null);
    try {
      const totp = await user.createTOTP();
      setTotpSecret(totp.secret ?? null);
      setTotpUri(totp.uri ?? null);
    } catch (err) {
      if (allowReverify && isReverificationError(err)) {
        await beginReverification("enable");
      } else {
        setErrorMsg(getClerkErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const runDisableTotp = async (allowReverify = true) => {
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);
    setFeedback(null);
    setBackupCodes(null);
    try {
      await user.disableTOTP();
      await user.reload();
      setFeedback("Authenticator app 2FA has been disabled.");
    } catch (err) {
      if (allowReverify && isReverificationError(err)) {
        await beginReverification("disable");
      } else {
        setErrorMsg(getClerkErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const runCreateBackupCodes = async (allowReverify = true) => {
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);
    setFeedback(null);
    try {
      const resource = await user.createBackupCode();
      await user.reload();
      setBackupCodes(resource.codes ?? []);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
      setFeedback("New single-use backup codes generated.");
    } catch (err) {
      if (allowReverify && isReverificationError(err)) {
        await beginReverification("backup_codes");
      } else {
        setErrorMsg(getClerkErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReverification = async () => {
    if (!session || !reverifyMethod || !reverifyInput.trim()) {
      setErrorMsg("Please complete verification first.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res =
        reverifyMethod === "email_code"
          ? await session.attemptFirstFactorVerification({
              strategy: "email_code",
              code: reverifyInput.trim(),
            })
          : await session.attemptFirstFactorVerification({
              strategy: "password",
              password: reverifyInput,
            });

      if (res.status === "complete") {
        const action = pendingAction;
        setReverifyMethod(null);
        setReverifyInput("");
        setPendingAction(null);
        setFeedback(null);
        if (action === "enable") await runCreateTotp(false);
        else if (action === "disable") await runDisableTotp(false);
        else if (action === "backup_codes") await runCreateBackupCodes(false);
      } else {
        setErrorMsg("Verification incomplete. Please try again.");
      }
    } catch (err) {
      setErrorMsg(getClerkErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTotp = async () => {
    if (!user || code.trim().length < 6) {
      setErrorMsg("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const verified = await user.verifyTOTP({ code: code.trim() });
      await user.reload();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
      setTotpSecret(null);
      setTotpUri(null);
      setCode("");
      if (verified.backupCodes?.length) {
        setBackupCodes(verified.backupCodes);
      }
      setFeedback("Two-factor authentication is now active.");
    } catch (err) {
      setErrorMsg(getClerkErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBottomSheet
      visible={visible}
      onClose={handleClose}
      withKeyboardAvoidance
    >
      {(requestClose) => (
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2.5">
              <View className="w-9 h-9 rounded-[11px] bg-[#30D158]/15 items-center justify-center">
                <ShieldCheck size={20} color="#30D158" />
              </View>
              <View>
                <Text className="text-[19px] font-jakarta-bold text-black dark:text-white tracking-[-0.3px]">
                  Two-Factor Authentication
                </Text>
                <Text className="text-[12px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D]">
                  {email}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => requestClose()}
              accessibilityLabel="Close 2FA sheet"
              className="w-8 h-8 rounded-full bg-black/[0.07] dark:bg-white/[0.12] items-center justify-center"
            >
              <X size={16} color={isDark ? "#FFFFFF" : "#000000"} />
            </Pressable>
          </View>

          <View className="rounded-[18px] bg-white dark:bg-[#2C2C2E] p-4 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[14px] font-jakarta-semibold text-black dark:text-white">
                Account 2FA Status
              </Text>
              <View
                className={`px-2.5 py-1 rounded-full ${
                  is2faEnabled ? "bg-[#30D158]/15" : "bg-[#FF9F0A]/15"
                }`}
              >
                <Text
                  className={`text-[11px] font-jakarta-bold ${
                    is2faEnabled ? "text-[#30D158]" : "text-[#FF9F0A]"
                  }`}
                >
                  {is2faEnabled ? "ACTIVE" : "NOT ENABLED"}
                </Text>
              </View>
            </View>
            <Text className="text-[13px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D] leading-[19px]">
              {is2faEnabled
                ? "Your Clerk account is protected with two-factor authentication. Signing in from a new device requires verification."
                : "Add an authenticator app (Google Authenticator, 1Password, or Apple Passwords) to protect your WealthFlow account."}
            </Text>
          </View>

          {toastMessage && (
            <Animated.View
              entering={FadeInDown.duration(180)}
              exiting={FadeOutUp.duration(160)}
              className="mb-3"
            >
              <ToastAlert type="success" message={toastMessage} />
            </Animated.View>
          )}

          {/* Inline Clerk Session Reverification Step */}
          {reverifyMethod && (
            <View className="rounded-[18px] bg-white dark:bg-[#2C2C2E] p-4 mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <MailCheck size={16} color="#007AFF" />
                <Text className="text-[13px] font-jakarta-bold text-black dark:text-white">
                  {reverifyMethod === "email_code"
                    ? "Verify Your Email Code"
                    : "Confirm Your Password"}
                </Text>
              </View>
              <TextInput
                value={reverifyInput}
                onChangeText={setReverifyInput}
                keyboardType={
                  reverifyMethod === "email_code" ? "number-pad" : "default"
                }
                secureTextEntry={reverifyMethod === "password"}
                placeholder={
                  reverifyMethod === "email_code"
                    ? "Enter 6-digit email code"
                    : "Enter your account password"
                }
                placeholderTextColor={isDark ? "#8E8E93" : "#6B7280"}
                className="h-11 px-3.5 rounded-[12px] bg-black/[0.05] dark:bg-white/[0.08] text-[15px] font-jakarta-semibold text-black dark:text-white"
              />
            </View>
          )}

          {/* Authenticator Setup Key + 1-Tap URI */}
          {totpSecret && !reverifyMethod && (
            <View className="rounded-[18px] bg-white dark:bg-[#2C2C2E] p-4 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <KeyRound size={16} color="#007AFF" />
                  <Text className="text-[13px] font-jakarta-bold text-black dark:text-white">
                    Authenticator Setup Key
                  </Text>
                </View>

                {totpUri && (
                  <Pressable
                    onPress={() => Linking.openURL(totpUri).catch(() => {})}
                    className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-[#007AFF]/12"
                  >
                    <Text className="text-[11px] font-jakarta-bold text-[#007AFF]">
                      Open App
                    </Text>
                    <ExternalLink size={11} color="#007AFF" />
                  </Pressable>
                )}
              </View>

              <Pressable
                onPress={handleCopySecret}
                accessibilityRole="button"
                accessibilityLabel="Copy authenticator setup key"
                className="flex-row items-center justify-between gap-2 bg-[#007AFF]/10 px-3 py-2.5 rounded-[12px] mb-3"
              >
                <Text
                  selectable
                  numberOfLines={1}
                  className="flex-1 text-[13px] font-jakarta-semibold text-[#007AFF]"
                >
                  {totpSecret}
                </Text>
                {copiedTarget === "key" ? (
                  <Check size={16} color="#30D158" strokeWidth={2.5} />
                ) : (
                  <Copy size={15} color="#007AFF" />
                )}
              </Pressable>

              <TextInput
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Enter 6-digit verification code"
                placeholderTextColor={isDark ? "#8E8E93" : "#6B7280"}
                className="h-11 px-3.5 rounded-[12px] bg-black/[0.05] dark:bg-white/[0.08] text-[15px] font-jakarta-semibold text-black dark:text-white"
              />
            </View>
          )}

          {/* Backup Codes with Copy & Download PDF buttons */}
          {backupCodes && backupCodes.length > 0 && !reverifyMethod && (
            <View className="rounded-[18px] bg-white dark:bg-[#2C2C2E] p-4 mb-4">
              <Text className="text-[14px] font-jakarta-bold text-black dark:text-white mb-0.5">
                Save Your Backup Codes
              </Text>
              <Text className="text-[11px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D] mb-3">
                Single-use recovery codes for your WealthFlow account.
              </Text>

              <View className="flex-row flex-wrap gap-2 mb-3.5">
                {backupCodes.map((c, idx) => (
                  <View
                    key={`${c}-${idx}`}
                    className="w-[48.5%] flex-row items-center gap-2 px-2.5 py-2 rounded-[10px] bg-black/[0.04] dark:bg-white/[0.07]"
                  >
                    <Text className="text-[10px] font-jakarta-bold text-[#007AFF]">
                      {String(idx + 1).padStart(2, "0")}
                    </Text>
                    <Text
                      selectable
                      className="text-[12px] font-jakarta-semibold text-black dark:text-white"
                    >
                      {c}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="flex-row gap-2.5">
                <Pressable
                  onPress={handleCopyBackupCodes}
                  className="flex-1 h-[42px] rounded-[12px] bg-black/[0.06] dark:bg-white/[0.1] flex-row items-center justify-center gap-1.5"
                >
                  {copiedTarget === "codes" ? (
                    <Check size={15} color="#30D158" strokeWidth={2.5} />
                  ) : (
                    <Copy
                      size={15}
                      color={isDark ? "#FFFFFF" : "#000000"}
                    />
                  )}
                  <Text className="text-[13px] font-jakarta-semibold text-black dark:text-white">
                    {copiedTarget === "codes" ? "Copied" : "Copy Codes"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="flex-1 h-[42px] rounded-[12px] bg-[#007AFF]/14 flex-row items-center justify-center gap-1.5"
                >
                  {downloadingPdf ? (
                    <ActivityIndicator size="small" color="#007AFF" />
                  ) : (
                    <Download size={15} color="#007AFF" />
                  )}
                  <Text className="text-[13px] font-jakarta-semibold text-[#007AFF]">
                    {downloadingPdf ? "Creating..." : "Download PDF"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {feedback && (
            <View className="flex-row items-center gap-2 mb-3 px-1">
              <CheckCircle2 size={16} color="#30D158" />
              <Text className="text-[13px] font-jakarta-medium text-[#30D158] flex-1">
                {feedback}
              </Text>
            </View>
          )}

          {errorMsg && (
            <Text className="text-[12px] font-jakarta-medium text-[#FF453A] mb-3 px-1">
              {errorMsg}
            </Text>
          )}

          {reverifyMethod ? (
            <Pressable
              onPress={handleSubmitReverification}
              disabled={loading}
              className="h-[50px] rounded-[16px] bg-[#007AFF] items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-[15px] font-jakarta-bold text-white">
                  Confirm & Continue
                </Text>
              )}
            </Pressable>
          ) : totpSecret ? (
            <Pressable
              onPress={handleVerifyTotp}
              disabled={loading}
              className="h-[50px] rounded-[16px] bg-[#007AFF] items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-[15px] font-jakarta-bold text-white">
                  Verify & Activate 2FA
                </Text>
              )}
            </Pressable>
          ) : is2faEnabled ? (
            <View className="gap-2.5">
              <Pressable
                onPress={() => runCreateBackupCodes(true)}
                disabled={loading}
                className="h-[48px] rounded-[16px] bg-[#007AFF]/12 flex-row items-center justify-center gap-2"
              >
                {loading ? (
                  <ActivityIndicator color="#007AFF" />
                ) : (
                  <>
                    <RefreshCw size={16} color="#007AFF" />
                    <Text className="text-[14px] font-jakarta-bold text-[#007AFF]">
                      Generate New Backup Codes
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={() => runDisableTotp(true)}
                disabled={loading}
                className="h-[48px] rounded-[16px] bg-[#FF453A]/12 items-center justify-center"
              >
                <Text className="text-[14px] font-jakarta-bold text-[#FF453A]">
                  Disable Authenticator 2FA
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => runCreateTotp(true)}
              disabled={loading}
              className="h-[50px] rounded-[16px] bg-[#007AFF] items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-[15px] font-jakarta-bold text-white">
                  Set Up Authenticator App
                </Text>
              )}
            </Pressable>
          )}
        </ScrollView>
      )}
    </AnimatedBottomSheet>
  );
}
