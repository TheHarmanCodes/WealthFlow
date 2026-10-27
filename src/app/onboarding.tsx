import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  useWindowDimensions,
  BackHandler,
  useColorScheme,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ONBOARDING_SLIDES } from "@/constants/onboarding";
import { completeOnboarding } from "@/lib/onboarding";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { GlassButton } from "@/components/ui/glass-button";

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const isDark = useColorScheme() === "dark";

  const slide = ONBOARDING_SLIDES[index];
  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const onPageChange = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
      setIndex(newIndex);
    },
    [width]
  );

  const handleSkip = useCallback(async () => {
    await completeOnboarding();
    router.replace("/(auth)/sign-in");
  }, [router]);

  const handleNext = useCallback(async () => {
    if (index < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = index + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setIndex(nextIndex);
    } else {
      await completeOnboarding();
      router.replace("/(auth)/sign-up");
    }
  }, [index, width, router]);

  // Android hardware back button
  useEffect(() => {
    const handleBackPress = () => {
      if (index > 0) {
        const prevIndex = index - 1;
        scrollViewRef.current?.scrollTo({
          x: prevIndex * width,
          animated: true,
        });
        setIndex(prevIndex);
        return true;
      }
      BackHandler.exitApp();
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => sub.remove();
  }, [index, width]);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0B0B1A" : "#FFFFFF" }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Top Bar: GlassButton (matching airbnb-clone pattern) ── */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 16,
          right: 24,
          zIndex: 20,
        }}
      >
        <GlassButton
          title="Skip"
          onPress={handleSkip}
          disabled={isLast}
          accessibilityLabel="Skip onboarding"
        />
      </View>

      {/* ── Middle Horizontal ScrollView (Airbnb style) ── */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onPageChange}
        style={{ flex: 1 }}
      >
        {ONBOARDING_SLIDES.map((s, i) => (
          <View
            key={s.id}
            style={{
              width,
              height,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: insets.top + 70,
            }}
          >
            {/* Rectangle Skeleton Placeholder */}
            <View
              style={{
                width: Math.min(Math.round(width * 0.78), 300),
                height: Math.min(Math.round(width * 0.95), 360),
                borderWidth: 2,
                borderColor: isDark ? "#334155" : "#0F172A",
                borderRadius: 16,
                backgroundColor: isDark ? "#1E293B" : "#F8FAFC",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: isDark ? "#F8FAFC" : "#0F172A",
                }}
              >
                Page {i + 1}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── Bottom Fixed Sheet: Title, Subtitle, Dots, Next Button ── */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDark ? "#0B0B1A" : "#FFFFFF",
          paddingHorizontal: 24,
          paddingBottom: Math.max(insets.bottom, 24) + 8,
          paddingTop: 16,
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Title */}
        <Text
          variant="display"
          className="text-[26px] font-jakarta-bold text-ink dark:text-surface text-center mb-2 tracking-tight"
        >
          {slide.title}
        </Text>

        {/* Subtitle */}
        <Text
          variant="body"
          tone="muted"
          className="text-[15px] leading-relaxed font-jakarta text-ink-muted dark:text-ink-subtle text-center max-w-[320px] mb-6"
        >
          {slide.subtitle}
        </Text>

        {/* Page Dots (Airbnb pattern) */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 20,
          }}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={`Page ${index + 1} of ${ONBOARDING_SLIDES.length}`}
        >
          {ONBOARDING_SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                height: 8,
                width: i === index ? 24 : 8,
                borderRadius: 4,
                backgroundColor: i === index ? "#0A84FF" : isDark ? "#334155" : "#CBD5E1",
              }}
            />
          ))}
        </View>

        {/* Action Button */}
        <Button
          title={isLast ? "Get Started" : "Next"}
          variant="primary"
          size="lg"
          onPress={handleNext}
          accessibilityLabel={
            isLast ? "Get started and create account" : "Continue to next slide"
          }
          className="w-full h-14 rounded-full bg-primary active:opacity-90"
        />
      </View>
    </View>
  );
}
