/**
 * Slide2Illustration — Expense tracking dashboard card with chart.
 *
 * Built entirely with View + expo-linear-gradient + Text.
 * Zero react-native-svg — avoids the Fabric/Android blank render bug
 * in react-native-svg 15.x on RN 0.86 New Architecture.
 */
import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export interface IllustrationProps {
  size?: number;
}

export function Slide2Illustration({ size = 280 }: IllustrationProps) {
  const s = size / 280;

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityLabel="Expense tracking chart and dashboard illustration"
      accessibilityRole="image"
    >
      {/* Ambient glow */}
      <LinearGradient
        colors={["rgba(56,189,248,0.32)", "rgba(244,114,182,0.22)", "transparent"]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />

      {/* ── Main Dashboard Card ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.1,
          top: size * 0.13,
          width: size * 0.75,
          height: size * 0.58,
          borderRadius: 22 * s,
          overflow: "hidden",
          borderWidth: 1.5 * s,
          borderColor: "rgba(255,255,255,0.9)",
        }}
      >
        {/* Card glass bg */}
        <LinearGradient
          colors={["rgba(255,255,255,0.96)", "rgba(240,249,255,0.92)"]}
          style={{ flex: 1 }}
        />
      </View>

      {/* Progress bar row inside card */}
      {/* Track */}
      <View
        style={{
          position: "absolute",
          left: size * 0.57,
          top: size * 0.21,
          width: size * 0.22,
          height: 5 * s,
          borderRadius: 3 * s,
          backgroundColor: "#E2E8F0",
        }}
      />
      {/* Fill */}
      <View
        style={{
          position: "absolute",
          left: size * 0.57,
          top: size * 0.21,
          width: size * 0.14,
          height: 5 * s,
          borderRadius: 3 * s,
          backgroundColor: "#38BDF8",
        }}
      />

      {/* ── Trend waves (layered trapezoidal shapes simulate curves) ── */}
      {/* Pink wave area */}
      <View
        style={{
          position: "absolute",
          left: size * 0.1,
          top: size * 0.51,
          width: size * 0.75,
          height: size * 0.16,
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["rgba(251,113,133,0.25)", "rgba(251,113,133,0.08)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
      {/* Pink wave top line strip */}
      <View
        style={{
          position: "absolute",
          left: size * 0.12,
          top: size * 0.51,
          width: size * 0.7,
          height: 3 * s,
          borderRadius: 2 * s,
          backgroundColor: "#FB7185",
          transform: [{ rotate: "-4deg" }],
        }}
      />

      {/* Blue wave area */}
      <View
        style={{
          position: "absolute",
          left: size * 0.1,
          top: size * 0.42,
          width: size * 0.75,
          height: size * 0.2,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["rgba(14,165,233,0.3)", "rgba(56,189,248,0.08)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
      {/* Blue wave top line */}
      <View
        style={{
          position: "absolute",
          left: size * 0.12,
          top: size * 0.42,
          width: size * 0.7,
          height: 4 * s,
          borderRadius: 2 * s,
          backgroundColor: "#0EA5E9",
          transform: [{ rotate: "-10deg" }],
        }}
      />

      {/* Data point dots */}
      <View
        style={{
          position: "absolute",
          left: size * 0.39,
          top: size * 0.39,
          width: 10 * s,
          height: 10 * s,
          borderRadius: 5 * s,
          backgroundColor: "#0EA5E9",
          borderWidth: 2 * s,
          borderColor: "#FFFFFF",
        }}
      />
      <View
        style={{
          position: "absolute",
          right: size * 0.12,
          top: size * 0.3,
          width: 10 * s,
          height: 10 * s,
          borderRadius: 5 * s,
          backgroundColor: "#38BDF8",
          borderWidth: 2 * s,
          borderColor: "#FFFFFF",
        }}
      />
      <View
        style={{
          position: "absolute",
          left: size * 0.47,
          top: size * 0.49,
          width: 9 * s,
          height: 9 * s,
          borderRadius: 5 * s,
          backgroundColor: "#FB7185",
          borderWidth: 2 * s,
          borderColor: "#FFFFFF",
        }}
      />

      {/* ── "Add Expense" floating pill ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.03,
          top: size * 0.06,
          width: size * 0.44,
          height: size * 0.11,
          borderRadius: size * 0.055,
          backgroundColor: "#FFFFFF",
          borderWidth: 1.5 * s,
          borderColor: "#E2E8F0",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: size * 0.03,
          gap: size * 0.025,
          elevation: 4,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        {/* Blue circle with + */}
        <View
          style={{
            width: size * 0.07,
            height: size * 0.07,
            borderRadius: size * 0.035,
            backgroundColor: "#0A84FF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 14 * s, fontWeight: "700", lineHeight: 16 * s }}>+</Text>
        </View>
        <Text style={{ color: "#0F172A", fontSize: 10 * s, fontWeight: "700" }}>Add Expense</Text>
        {/* Cursor arrow emoji-like indicator */}
        <Text style={{ fontSize: 12 * s, marginLeft: 2 * s }}>👆</Text>
      </View>

      {/* ── Bottom-left mini card: Bar chart ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.06,
          bottom: size * 0.1,
          width: size * 0.26,
          height: size * 0.22,
          borderRadius: 14 * s,
          backgroundColor: "#FFFFFF",
          borderWidth: 1.5 * s,
          borderColor: "rgba(255,255,255,0.9)",
          overflow: "hidden",
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 8 * s, paddingBottom: 8 * s, gap: 4 * s }}>
          <View style={{ flex: 1, height: "55%", borderRadius: 4 * s, backgroundColor: "#34D399" }} />
          <View style={{ flex: 1, height: "80%", borderRadius: 4 * s, backgroundColor: "#22D3EE" }} />
          <View style={{ flex: 1, height: "95%", borderRadius: 4 * s, backgroundColor: "#3B82F6" }} />
          <View style={{ flex: 1, height: "70%", borderRadius: 4 * s, backgroundColor: "#A855F7" }} />
        </View>
      </View>

      {/* ── Bottom-right mini card: % indicator ── */}
      <View
        style={{
          position: "absolute",
          right: size * 0.06,
          bottom: size * 0.1,
          width: size * 0.26,
          height: size * 0.22,
          borderRadius: 14 * s,
          backgroundColor: "#FFFFFF",
          borderWidth: 1.5 * s,
          borderColor: "rgba(255,255,255,0.9)",
          padding: 10 * s,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
        }}
      >
        <Text style={{ color: "#0A84FF", fontSize: 16 * s, fontWeight: "900", marginBottom: 4 * s }}>%</Text>
        {/* Blue progress bar */}
        <View style={{ width: "100%", height: 4 * s, borderRadius: 2 * s, backgroundColor: "#E2E8F0", marginBottom: 5 * s }}>
          <View style={{ width: "65%", height: "100%", borderRadius: 2 * s, backgroundColor: "#38BDF8" }} />
        </View>
        {/* Pink progress bar */}
        <View style={{ width: "100%", height: 4 * s, borderRadius: 2 * s, backgroundColor: "#E2E8F0" }}>
          <View style={{ width: "45%", height: "100%", borderRadius: 2 * s, backgroundColor: "#FB7185" }} />
        </View>
      </View>
    </View>
  );
}
