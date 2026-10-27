import React from "react";
import { View, Text } from "react-native";
import type { OnboardingSlideData } from "@/constants/onboarding";

export interface OnboardingSlideProps {
  data: OnboardingSlideData;
  isActive: boolean;
  width: number;
}

export function OnboardingSlide({
  data,
  width,
}: OnboardingSlideProps) {
  // Extract slide number from id or illustration
  const pageNumber =
    data.illustration === "slide1"
      ? "1"
      : data.illustration === "slide2"
      ? "2"
      : "3";

  return (
    <View
      style={{ width }}
      className="flex-1 px-8 items-center justify-between py-2"
    >
      {/* Rectangle Box Area (Skeleton) */}
      <View className="flex-1 w-full items-center justify-center py-4">
        <View
          style={{
            width: Math.min(Math.round(width * 0.78), 320),
            aspectRatio: 0.9,
            borderWidth: 2,
            borderColor: "#1E293B",
            borderRadius: 16,
            backgroundColor: "#F8FAFC",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#334155",
            }}
          >
            Page {pageNumber}
          </Text>
        </View>
      </View>

      {/* Copy Content Area (Headline & Subtitle) */}
      <View className="w-full pb-4 items-center">
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#0B0B1A",
            textAlign: "center",
            marginBottom: 12,
            letterSpacing: -0.5,
          }}
        >
          {data.title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            lineHeight: 22,
            color: "#6B7280",
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          {data.subtitle}
        </Text>
      </View>
    </View>
  );
}
