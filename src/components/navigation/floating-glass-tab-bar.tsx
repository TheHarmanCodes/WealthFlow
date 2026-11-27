/**
 * FloatingGlassTabBar — Android / cross-platform bottom nav bar.
 *
 * Visual design:
 *  • Floating pill, horizontally centred, above safe-area inset
 *  • Liquid-glass surface: BlurView + semi-transparent colour tint
 *  • Hairline border + drop shadow for depth
 *  • h-16 rounded-full overflow-hidden clips per-tab ripples at the pill edges
 *
 * Android icons (via react-native-svg wrappers in android-tab-icons.tsx):
 *  Home   → home-alt-2-filled (boxicons)
 *  Stats  → graph-bar (uis)
 *  AI     → quill-pen-ai-line (remixicon)
 *  Wallet → wallet (fa-solid)
 *  Profile → User (lucide — unchanged)
 */

import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { User } from "lucide-react-native";
import {
  HomeAlt2FilledIcon,
  GraphBarIcon,
  QuillPenAiIcon,
  WalletSolidIcon,
} from "./android-tab-icons";
import { GlassTabItem } from "./glass-tab-item";

// ─── Type ─────────────────────────────────────────────────────────────────────
export type BottomTabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];

// ─── Icons ────────────────────────────────────────────────────────────────────
function TabIcon({
  route,
  color,
  size,
}: {
  route: string;
  color: string;
  size: number;
}) {
  switch (route) {
    case "index":
      return <HomeAlt2FilledIcon color={color} size={size} />;
    case "stats":
      return <GraphBarIcon color={color} size={size} />;
    case "ai":
      return <QuillPenAiIcon color={color} size={size} />;
    case "wallet":
      return <WalletSolidIcon color={color} size={size} />;
    case "profile":
      return <User size={size} color={color} fill={color} strokeWidth={2} />;
    default:
      return <HomeAlt2FilledIcon color={color} size={size} />;
  }
}

// ─── Labels ───────────────────────────────────────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  index: "Home",
  stats: "Stats",
  ai: "AI",
  wallet: "Wallet",
  profile: "Profile",
};

function getLabel(route: string, override?: string) {
  return override ?? ROUTE_LABELS[route] ?? route;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function FloatingGlassTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const bottom = Math.max(insets.bottom, 12);

  const scrimColors = isDark
    ? ([
        "rgba(0, 0, 0, 0.50)",
        "rgba(0, 0, 0, 0.24)",
        "rgba(0, 0, 0, 0.06)",
        "rgba(0, 0, 0, 0)",
      ] as const)
    : ([
        "rgba(0, 0, 0, 0.13)",
        "rgba(0, 0, 0, 0.06)",
        "rgba(0, 0, 0, 0.015)",
        "rgba(0, 0, 0, 0)",
      ] as const);

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 bottom-0 items-center z-[999]"
    >
      {/* Full-width bottom-0 upward-fading gradient scrim behind the pill */}
      <LinearGradient
        pointerEvents="none"
        colors={scrimColors}
        locations={[0, 0.32, 0.7, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: insets.bottom + 92,
        }}
      />

      <View
        pointerEvents="box-none"
        className="w-full px-5 items-center"
        style={{ paddingBottom: bottom }}
      >
        <View className="w-full max-w-[420px] h-16 rounded-full">
          {/* Full-bleed clipping container (borderless so Android clips flush to edge) */}
          <View className="flex-1 rounded-full overflow-hidden">
            {/* Layer 1 — frosted glass */}
            <BlurView
              intensity={80}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
            {/* Layer 2 — colour tint (#F6F6F6 light / #202020 dark) */}
            <View className="absolute inset-0 bg-[#F6F6F6]/[0.82] dark:bg-[#202020]/[0.82]" />

            {/* Layer 3 — tab items (each owns its own ripple Animated.View) */}
            <View className="flex-1 flex-row items-center px-3">
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const label = getLabel(
                  route.name,
                  typeof options.tabBarLabel === "string"
                    ? options.tabBarLabel
                    : options.title,
                );

                const handlePress = () => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                };

                const handleLongPress = () =>
                  navigation.emit({ type: "tabLongPress", target: route.key });

                return (
                  <GlassTabItem
                    key={route.key}
                    name={route.name}
                    label={label}
                    isFocused={isFocused}
                    isDark={isDark}
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                    renderIcon={({ color, size }) => (
                      <TabIcon route={route.name} color={color} size={size} />
                    )}
                  />
                );
              })}
            </View>
          </View>

          {/* Hairline border overlaid on top so it never insets the ripple clip */}
          <View
            pointerEvents="none"
            className="absolute inset-0 rounded-full border border-black/[0.08] dark:border-white/[0.12]"
          />
        </View>
      </View>
    </View>
  );
}
