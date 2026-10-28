import { Text } from "@/components/ui/text";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import React from "react";
import { View, useColorScheme } from "react-native";

interface AuthStepperProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { step: 1, label: "Account Details" },
  { step: 2, label: "Security" },
  { step: 3, label: "Agreement" },
] as const;

const STEP_GRADIENT = ["#ff6f3a", "#ff9d01", "#fac971"] as const;

export function AuthStepper({ currentStep }: AuthStepperProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="w-full my-2 sm:my-5">
      <View className="flex-row items-center justify-between px-1">
        {STEPS.map((s, index) => {
          const isCompleted = currentStep > s.step;
          const isActive = currentStep === s.step;

          return (
            <React.Fragment key={s.step}>
              {/* Step indicator and label */}
              <View className="flex-1 min-w-0 items-center">
                {isCompleted ? (
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: "#22C55E",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 6,
                      overflow: "hidden",
                    }}
                  >
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                  </View>
                ) : isActive ? (
                  <LinearGradient
                    colors={STEP_GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 6,
                      overflow: "hidden",
                    }}
                  >
                    <Text className="text-xs sm:text-sm font-jakarta-bold text-white">
                      {s.step}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                      borderWidth: 1,
                      borderColor: isDark ? "#334155" : "#CBD5E1",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{ color: isDark ? "#64748B" : "#94A3B8" }}
                      className="text-xs sm:text-sm font-jakarta-bold"
                    >
                      {s.step}
                    </Text>
                  </View>
                )}

                <Text
                  style={{
                    color: isActive
                      ? isDark
                        ? "#FFFFFF"
                        : "#0B0B1A"
                      : isDark
                        ? "#64748B"
                        : "#94A3B8",
                  }}
                  className="text-[11px] sm:text-xs text-center font-jakarta-medium min-h-8"
                >
                  {s.label}
                </Text>
              </View>

              {/* Connecting line */}
              {index < STEPS.length - 1 && (
                <View
                  style={{
                    backgroundColor: isCompleted
                      ? "#22C55E"
                      : isDark
                        ? "#1E293B"
                        : "#E2E8F0",
                  }}
                  className="h-0.5 flex-1 px-1 -mt-8"
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
