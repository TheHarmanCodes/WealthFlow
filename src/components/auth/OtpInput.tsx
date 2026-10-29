import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { Clock } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  TextInput,
  useColorScheme,
  View,
  type TextInputKeyPressEvent,
} from "react-native";

interface OtpInputProps {
  code: string;
  onChangeCode: (code: string) => void;
  error?: string;
  onResend?: () => boolean | Promise<boolean>;
  cooldownSeconds?: number;
  onFocus?: () => void;
}

export function OtpInput({
  code,
  onChangeCode,
  error,
  onResend,
  cooldownSeconds = 60,
  onFocus,
}: OtpInputProps) {
  const isDark = useColorScheme() === "dark";
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(cooldownSeconds);

  // Derive resend eligibility from timer state to avoid cascading effect renders
  const canResend = timeLeft <= 0;

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }
    // Set a timeout to decrement the timer every second
    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // format timer in MM:SS format
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResend = async () => {
    if (!canResend) return;
    const resendSucceeded = onResend ? await onResend() : true;
    if (resendSucceeded) {
      // Reset the timer to the cooldown period
      setTimeLeft(cooldownSeconds);
    }
  };

  const digits = Array.from({ length: 6 }, (_, i) => code[i] || "");

  const handleDigitChange = (value: string, index: number) => {
    if (value.length > 1) {
      const sanitized = value.replace(/\D/g, "").slice(0, 6);
      onChangeCode(sanitized);
      const nextFocus = Math.min(sanitized.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const cleanChar = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = cleanChar;
    const newCode = newDigits.join("");
    onChangeCode(newCode);

    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: TextInputKeyPressEvent, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChangeCode(newDigits.join(""));
      }
    }
  };

  return (
    <View className="w-full my-3">
      <View className="flex-row items-center justify-between mb-3.5">
        <Text
          style={{ color: isDark ? "#94A3B8" : "#64748B" }}
          className="text-xs font-jakarta-bold tracking-wider uppercase"
        >
          Enter 6-Digit Security Code
        </Text>
        <Text
          style={{ color: isDark ? "#64748B" : "#94A3B8" }}
          className="text-[11px] font-jakarta"
        >
          Valid for 10 min
        </Text>
      </View>

      {/* 6 Digit Inputs */}
      <View className="flex-row items-center justify-between gap-2 sm:gap-2.5 mb-3.5">
        {Array.from({ length: 6 }).map((_, index) => {
          const digit = digits[index];
          const isFocused =
            code.length === index || (code.length === 6 && index === 5);

          return (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(val) => handleDigitChange(val, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => {
                onFocus?.();
              }}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              maxLength={index === 0 ? 6 : 1}
              selectTextOnFocus
              style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                borderColor: error
                  ? "#EF4444"
                  : isFocused
                    ? isDark
                      ? "#38BDF8"
                      : "#0A84FF"
                    : isDark
                      ? "#1E293B"
                      : "#CBD5E1",
                color: isDark ? "#FFFFFF" : "#0B0B1A",
              }}
              className={cn(
                "flex-1 h-13 sm:h-15 text-center font-jakarta-bold text-lg sm:text-2xl rounded-lg border",
              )}
            />
          );
        })}
      </View>

      {error && (
        <Text
          style={{ color: "#EF4444" }}
          className="text-xs font-jakarta mb-3 text-center"
        >
          {error}
        </Text>
      )}

      {/* Timer & Resend Row */}
      <View className="flex-row items-center justify-between mt-0.5 px-1">
        <View className="flex-row items-center gap-1.5">
          <Clock size={14} color={isDark ? "#94A3B8" : "#64748B"} />
          <Text
            style={{ color: isDark ? "#94A3B8" : "#64748B" }}
            className="text-xs font-jakarta"
          >
            {canResend ? (
              "Didn't receive code?"
            ) : (
              <>
                Resend available in:{" "}
                <Text
                  style={{ color: "#38BDF8" }}
                  className="font-jakarta-bold text-sm"
                >
                  {formatTimer(timeLeft)}
                </Text>
              </>
            )}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Resend security code"
          onPress={handleResend}
          disabled={!canResend}
          className="active:opacity-60"
        >
          <Text
            style={{
              color: canResend ? "#38BDF8" : isDark ? "#475569" : "#94A3B8",
            }}
            className="text-xs font-jakarta-semibold"
          >
            Resend Code
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
