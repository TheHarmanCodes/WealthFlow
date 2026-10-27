import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { Clock } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  TextInput,
  useColorScheme,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native";

interface OtpInputProps {
  code: string;
  onChangeCode: (code: string) => void;
  error?: string;
  onResend?: () => void;
  expirySeconds?: number;
}

export function OtpInput({
  code,
  onChangeCode,
  error,
  onResend,
  expirySeconds = 60,
}: OtpInputProps) {
  const isDark = useColorScheme() === "dark";
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(expirySeconds);
  const [resendActive, setResendActive] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setResendActive(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResend = () => {
    setTimeLeft(expirySeconds);
    setResendActive(false);
    onResend?.();
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

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
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
      <Text
        style={{ color: isDark ? "#94A3B8" : "#64748B" }}
        className="text-xs font-jakarta-bold tracking-wider mb-3.5 uppercase font-bold"
      >
        Enter 6-Digit Security Code
      </Text>

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
              keyboardType="number-pad"
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
            Code expires in:{" "}
            <Text
              style={{ color: "#38BDF8" }}
              className="font-jakarta-bold text-sm"
            >
              {formatTimer(timeLeft)}
            </Text>
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Resend security code"
          onPress={handleResend}
          disabled={!resendActive}
          className="active:opacity-60"
        >
          <Text
            style={{
              color: resendActive ? "#38BDF8" : isDark ? "#475569" : "#94A3B8",
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
