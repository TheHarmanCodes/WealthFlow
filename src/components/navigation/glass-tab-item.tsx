/**
 * GlassTabItem — single tab button inside FloatingGlassTabBar.
 *
 * Ripple behaviour (state-driven, touch-only):
 *  • onPressIn : captures isFocused at that instant (before navigation fires)
 *      – inactive tab → grey ripple
 *      – active re-tap  → soft-blue ripple
 *  • Animation: pure ease-out, zero bounce, no scale on icon/label.
 *  • Quick-tap guarantee: pressOut is delayed by however many ms remain in the
 *    scale-in animation so the circle always reaches full size before fading.
 *  • Ripple fades fully to opacity 0 at rest — no permanent ring behind active tab.
 */

import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/cn";

// ─── Tunable constants ────────────────────────────────────────────────────────
const RIPPLE_SIZE = 95; // px — 54px radius extends past pill end-caps; clipped by pill overflow-hidden
const RIPPLE_SCALE_FROM = 0.75; // starting scale on press-in
const FADE_IN_OPACITY_MS = 100; // opacity 0 → 1
const SCALE_IN_MS = 175; // scale 0.75 → 1
const FADE_OUT_MS = 300; // opacity 1 → 0 (after enter completes)

// Ripple colours
const RIPPLE_GREY_LIGHT = "rgba(0, 0, 0, 0.08)";
const RIPPLE_GREY_DARK = "rgba(255, 255, 255, 0.12)";
const RIPPLE_BLUE = "rgba(0, 122, 255, 0.14)";
// ─────────────────────────────────────────────────────────────────────────────

export interface GlassTabItemProps {
  name: string;
  label: string;
  isFocused: boolean;
  isDark: boolean;
  onPress: () => void;
  onLongPress: () => void;
  renderIcon: (props: { color: string; size: number }) => React.ReactNode;
}

export function GlassTabItem({
  label,
  isFocused,
  isDark,
  onPress,
  onLongPress,
  renderIcon,
}: GlassTabItemProps) {
  const iconColor = isFocused ? "#007AFF" : isDark ? "#FFFFFF" : "#000000";

  // ─── Shared values ───────────────────────────────────────────────────────
  const rippleOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(RIPPLE_SCALE_FROM);
  /** 1 = blue (re-tapping active tab), 0 = grey (tapping inactive tab) */
  const rippleIsBlue = useSharedValue(0);
  /** Wall-clock ms recorded at press-in to compute remaining enter time */
  const pressInTime = useSharedValue(0);

  // ─── Handlers (JS thread — no "worklet" directive needed) ───────────────
  function handlePressIn() {
    // 1. Capture focus state BEFORE navigation fires (colour decision)
    rippleIsBlue.set(isFocused ? 1 : 0);

    // 2. Reset scale to starting position so every press starts identically
    rippleScale.set(RIPPLE_SCALE_FROM);

    // 3. Record press timestamp (used in pressOut to guarantee full expansion)
    pressInTime.set(Date.now());

    // 4. Animate in
    rippleOpacity.set(
      withTiming(1, {
        duration: FADE_IN_OPACITY_MS,
        easing: Easing.out(Easing.quad),
      }),
    );
    rippleScale.set(
      withTiming(1, {
        duration: SCALE_IN_MS,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }

  function handlePressOut() {
    // Delay fade-out by whatever time remains in the scale-in animation so a
    // quick tap still sees the circle fully expand before it fades away.
    const elapsed = Date.now() - pressInTime.get();
    const remaining = Math.max(0, SCALE_IN_MS - elapsed);

    // Do NOT reset rippleScale here — let the circle stay at scale 1.0 while
    // fading so it looks full-size on release (no shrinking artefact).
    rippleOpacity.set(
      withDelay(
        remaining,
        withTiming(0, {
          duration: FADE_OUT_MS,
          easing: Easing.out(Easing.ease),
        }),
      ),
    );
  }

  // ─── Animated style ──────────────────────────────────────────────────────
  const greyColor = isDark ? RIPPLE_GREY_DARK : RIPPLE_GREY_LIGHT;

  const rippleStyle = useAnimatedStyle(() => {
    const blue = rippleIsBlue.get() === 1;
    return {
      opacity: rippleOpacity.get(),
      transform: [{ scale: rippleScale.get() }],
      backgroundColor: blue ? RIPPLE_BLUE : greyColor,
    };
  }, [greyColor]);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="flex-1 h-full items-center justify-center"
    >
      {/* Circular touch ripple — clipped by parent pill's overflow-hidden */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            width: RIPPLE_SIZE,
            height: RIPPLE_SIZE,
            borderRadius: 9999,
          },
          rippleStyle,
        ]}
      />

      {/* Icon + label — no scale animation on content */}
      <View className="items-center justify-center gap-0.5">
        <View className="h-5 items-center justify-center">
          {renderIcon({ color: iconColor, size: 26 })}
        </View>
        <Text
          numberOfLines={1}
          className={cn(
            "text-[10px] leading-[13px] text-center",
            isFocused
              ? "font-jakarta-bold text-[#007AFF]"
              : "font-jakarta-medium text-black dark:text-white",
          )}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
