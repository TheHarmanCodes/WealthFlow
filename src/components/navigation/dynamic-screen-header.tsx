import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Calendar,
  Download,
  MoreVertical,
  Settings,
} from "lucide-react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

// ─── Navbar-matched ripple & glass constants ──────────────────────────────────
const BUTTON_RIPPLE_SIZE = 54;
const RIPPLE_SCALE_FROM = 0.55;
const FADE_IN_OPACITY_MS = 100;
const SCALE_IN_MS = 250;
const FADE_OUT_MS = 350;

const RIPPLE_GREY_LIGHT = "rgba(0, 0, 0, 0.08)";
const RIPPLE_GREY_DARK = "rgba(255, 255, 255, 0.12)";

const MENU_OPTIONS = [
  { id: "date-range", label: "Date Range Filter", Icon: Calendar },
  { id: "export", label: "Export Statement", Icon: Download },
  { id: "preferences", label: "App Preference", Icon: Settings },
] as const;

export interface DynamicScreenHeaderProps {
  title: string;
  onMenuPress?: () => void;
  onSelectOption?: (optionId: (typeof MENU_OPTIONS)[number]["id"]) => void;
}

interface MenuOptionRowProps {
  label: string;
  Icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  isDark: boolean;
  onPress: () => void;
}

function useGlassRipple(isDark: boolean) {
  const rippleOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(RIPPLE_SCALE_FROM);
  const pressInTime = useSharedValue(0);

  function handlePressIn() {
    rippleScale.set(RIPPLE_SCALE_FROM);
    pressInTime.set(Date.now());
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
    const elapsed = Date.now() - pressInTime.get();
    const remaining = Math.max(0, SCALE_IN_MS - elapsed);
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

  const rippleColor = isDark ? RIPPLE_GREY_DARK : RIPPLE_GREY_LIGHT;
  const rippleStyle = useAnimatedStyle(
    () => ({
      opacity: rippleOpacity.get(),
      transform: [{ scale: rippleScale.get() }],
      backgroundColor: rippleColor,
    }),
    [rippleColor],
  );

  return { handlePressIn, handlePressOut, rippleStyle };
}

function MenuOptionRow({ label, Icon, isDark, onPress }: MenuOptionRowProps) {
  const { handlePressIn, handlePressOut, rippleStyle } = useGlassRipple(isDark);
  const contentColor = isDark ? "#FFFFFF" : "#000000";

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      className="relative flex-row items-center gap-3 px-4 py-3.5 overflow-hidden"
    >
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, rippleStyle]}
      />
      <Icon size={18} color={contentColor} strokeWidth={2} />
      <Text className="text-[15px] leading-[20px] font-jakarta-medium text-black dark:text-white">
        {label}
      </Text>
    </Pressable>
  );
}

export function DynamicScreenHeader({
  title,
  onMenuPress,
  onSelectOption,
}: DynamicScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuTop, setMenuTop] = useState(Math.max(insets.top, 16) + 64);
  const buttonRef = useRef<View>(null);
  const isClosing = useRef(false);
  const pendingAfterCloseRef = useRef<(() => void) | undefined>(undefined);

  // Origin-anchored popover animation state (expands from / collapses to the 40×40 ring)
  const menuScale = useSharedValue(0.15);
  const menuOpacity = useSharedValue(0);
  const menuWidth = useSharedValue(200);
  const menuHeight = useSharedValue(148);

  useEffect(() => {
    if (!menuVisible) return;
    isClosing.current = false;
    menuScale.set(0.15);
    menuOpacity.set(0);
    menuScale.set(
      withTiming(1, { duration: 120, easing: Easing.out(Easing.cubic) }),
    );
    menuOpacity.set(
      withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }),
    );
  }, [menuVisible, menuScale, menuOpacity]);

  const finishClose = useCallback(() => {
    const afterClose = pendingAfterCloseRef.current;
    pendingAfterCloseRef.current = undefined;
    isClosing.current = false;
    setMenuVisible(false);
    afterClose?.();
  }, []);

  const closeMenu = useCallback(
    (onAfterClose?: () => void) => {
      if (isClosing.current || !menuVisible) return;
      isClosing.current = true;
      pendingAfterCloseRef.current = onAfterClose;

      menuOpacity.set(
        withTiming(0, { duration: 130, easing: Easing.in(Easing.quad) }),
      );
      menuScale.set(
        withTiming(
          0.15,
          { duration: 160, easing: Easing.in(Easing.cubic) },
          (finished) => {
            if (finished) {
              runOnJS(finishClose)();
            }
          },
        ),
      );
    },
    [finishClose, menuOpacity, menuScale, menuVisible],
  );

  const menuAnimatedStyle = useAnimatedStyle(() => {
    const originOffsetX = menuWidth.get() / 2 - 20;
    const originOffsetY = -menuHeight.get() / 2;
    return {
      opacity: menuOpacity.get(),
      transform: [
        { translateX: originOffsetX },
        { translateY: originOffsetY },
        { scale: menuScale.get() },
        { translateX: -originOffsetX },
        { translateY: -originOffsetY },
      ],
    };
  });

  // Navbar-matched ease-out circular touch ripple on the 40×40 button
  const { handlePressIn, handlePressOut, rippleStyle } = useGlassRipple(isDark);

  const handleButtonPress = () => {
    if (onMenuPress) {
      onMenuPress();
      return;
    }

    buttonRef.current?.measureInWindow((_x, y, _w, h) => {
      // Ensure the popover always clears the status bar + 40px button even if
      // Android measureInWindow excludes insets.top inside a translucent Modal.
      const minButtonBottom = Math.max(insets.top, 16) + 12 + (h || 40);
      const buttonBottom = Math.max(y + (h || 40), minButtonBottom);
      setMenuTop(buttonBottom + 12);
      setMenuVisible(true);
    });
  };

  return (
    <>
      <View className="flex-row items-center justify-between px-5 py-3">
        {/* Left Side: Large, Bold Dynamic Screen Title */}
        <Text
          numberOfLines={1}
          className="text-[28px] tracking-[-0.5px] font-jakarta-bold text-black dark:text-white"
        >
          {title}
        </Text>

        {/* Right Side: 40×40 Circular Liquid-Glass Three-Dots Button */}
        <View
          ref={buttonRef}
          collapsable={false}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          {/* Unclipped circular touch ripple — blooms outside the 40×40 ring */}
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: "absolute",
                width: BUTTON_RIPPLE_SIZE,
                height: BUTTON_RIPPLE_SIZE,
                borderRadius: 9999,
              },
              rippleStyle,
            ]}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open options menu"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleButtonPress}
            className="w-full h-full rounded-full items-center justify-center"
          >
            {/* Clipped 40×40 frosted glass circle */}
            <View
              pointerEvents="none"
              className="absolute inset-0 rounded-full overflow-hidden"
            >
              <BlurView
                intensity={80}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
              <View className="absolute inset-0 bg-[#F6F6F6]/[0.82] dark:bg-[#202020]/[0.82]" />
            </View>

            {/* Three-dots icon */}
            <MoreVertical
              size={18}
              color={isDark ? "#FFFFFF" : "#000000"}
              strokeWidth={2.2}
            />
          </Pressable>

          {/* Hairline border ring */}
          <View
            pointerEvents="none"
            className="absolute inset-0 rounded-full border border-black/[0.08] dark:border-white/[0.12]"
          />
        </View>
      </View>

      {/* Transparent-backdrop popover menu */}
      <Modal
        visible={menuVisible}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={() => closeMenu()}
      >
        <Pressable className="flex-1" onPress={() => closeMenu()}>
          <Animated.View
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              if (width > 0) menuWidth.set(width);
              if (height > 0) menuHeight.set(height);
            }}
            className="absolute right-5 w-[200px] rounded-[24px]"
            style={[{ top: menuTop }, menuAnimatedStyle]}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="rounded-[24px]"
            >
              {/* Full-bleed clipping container (borderless so Android clips flush) */}
              <View className="rounded-[24px] overflow-hidden py-1.5">
                {/* Layer 1 — frosted glass */}
                <BlurView
                  intensity={80}
                  tint={isDark ? "dark" : "light"}
                  style={StyleSheet.absoluteFill}
                />
                {/* Layer 2 — colour tint (#F6F6F6 light / #202020 dark) */}
                <View className="absolute inset-0 bg-[#F6F6F6]/[0.82] dark:bg-[#202020]/[0.82]" />

                {/* Layer 3 — menu options */}
                {MENU_OPTIONS.map(({ id, label, Icon }) => (
                  <MenuOptionRow
                    key={id}
                    label={label}
                    Icon={Icon}
                    isDark={isDark}
                    onPress={() => closeMenu(() => onSelectOption?.(id))}
                  />
                ))}
              </View>

              {/* Hairline border overlaid */}
              <View
                pointerEvents="none"
                className="absolute inset-0 rounded-[24px] border border-black/[0.08] dark:border-white/[0.12]"
              />
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}
