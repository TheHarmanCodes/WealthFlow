/**
 * Slide3Illustration — Shield with padlock and security badges.
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

/** Small badge card reused for top-right and bottom-left */
function BadgeCard({ style }: { style: object }) {
  return (
    <View
      style={[
        {
          width: 60,
          height: 40,
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          borderWidth: 1.5,
          borderColor: "rgba(255,255,255,0.9)",
          padding: 7,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 5 }}>
        <View style={{ width: 10, height: 8, borderRadius: 3, backgroundColor: "#0A84FF" }} />
        <View style={{ flex: 1, height: 3.5, borderRadius: 2, backgroundColor: "#CBD5E1" }} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <View style={{ width: 26, height: 3.5, borderRadius: 2, backgroundColor: "#E2E8F0" }} />
        {/* Green check badge */}
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#10B981",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 8, fontWeight: "900", lineHeight: 10 }}>✓</Text>
        </View>
      </View>
    </View>
  );
}

export function Slide3Illustration({ size = 280 }: IllustrationProps) {
  const s = size / 280;
  const shieldW = size * 0.58;
  const shieldH = size * 0.66;
  const shieldLeft = (size - shieldW) / 2;
  const shieldTop = size * 0.1;

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityLabel="Security shield with padlock illustration"
      accessibilityRole="image"
    >
      {/* Ambient glow */}
      <LinearGradient
        colors={["rgba(56,189,248,0.38)", "rgba(59,130,246,0.22)", "transparent"]}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />

      {/* ── Orbit ring 1 ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.02,
          top: size * 0.14,
          width: size * 0.96,
          height: size * 0.72,
          borderRadius: size * 0.36,
          borderWidth: 1.5 * s,
          borderColor: "rgba(2,132,199,0.25)",
          transform: [{ scaleY: 0.45 }, { rotate: "-18deg" }],
        }}
      />
      {/* ── Orbit ring 2 ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.05,
          top: size * 0.18,
          width: size * 0.9,
          height: size * 0.64,
          borderRadius: size * 0.36,
          borderWidth: 1.5 * s,
          borderColor: "rgba(56,189,248,0.3)",
          transform: [{ scaleY: 0.42 }, { rotate: "22deg" }],
        }}
      />

      {/* ── Orbit node dots ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.04,
          top: size * 0.35,
          width: 10 * s,
          height: 10 * s,
          borderRadius: 5 * s,
          backgroundColor: "#F43F5E",
        }}
      />
      <View
        style={{
          position: "absolute",
          right: size * 0.04,
          top: size * 0.55,
          width: 11 * s,
          height: 11 * s,
          borderRadius: 6 * s,
          backgroundColor: "#22D3EE",
        }}
      />
      <View
        style={{
          position: "absolute",
          left: size * 0.2,
          bottom: size * 0.1,
          width: 9 * s,
          height: 9 * s,
          borderRadius: 5 * s,
          backgroundColor: "#3B82F6",
        }}
      />

      {/* ── Shield outer (tinted) ── */}
      {/* We simulate the shield shape using a View with borderRadius on each corner */}
      <View
        style={{
          position: "absolute",
          left: shieldLeft + 2 * s,
          top: shieldTop + 4 * s,
          width: shieldW,
          height: shieldH,
          overflow: "hidden",
          borderTopLeftRadius: shieldW * 0.38,
          borderTopRightRadius: shieldW * 0.38,
          borderBottomLeftRadius: shieldW * 0.52,
          borderBottomRightRadius: shieldW * 0.52,
          backgroundColor: "#BAE6FD",
          opacity: 0.65,
        }}
      />

      {/* ── Shield main face ── */}
      <View
        style={{
          position: "absolute",
          left: shieldLeft,
          top: shieldTop,
          width: shieldW,
          height: shieldH,
          overflow: "hidden",
          borderTopLeftRadius: shieldW * 0.38,
          borderTopRightRadius: shieldW * 0.38,
          borderBottomLeftRadius: shieldW * 0.52,
          borderBottomRightRadius: shieldW * 0.52,
          borderWidth: 3 * s,
          borderColor: "#FFFFFF",
        }}
      >
        <LinearGradient
          colors={["#E0F2FE", "#BAE6FD", "#7DD3FC"]}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Specular highlight strip on left of shield */}
      <View
        style={{
          position: "absolute",
          left: shieldLeft + shieldW * 0.08,
          top: shieldTop + shieldH * 0.06,
          width: shieldW * 0.22,
          height: shieldH * 0.7,
          borderRadius: shieldW * 0.12,
          backgroundColor: "rgba(255,255,255,0.38)",
          transform: [{ rotate: "5deg" }],
        }}
      />

      {/* ── Padlock shackle (arc simulated with two Views + border) ── */}
      {/* Left arm */}
      <View
        style={{
          position: "absolute",
          left: size * 0.375,
          top: size * 0.26,
          width: size * 0.06,
          height: size * 0.22,
          borderTopLeftRadius: size * 0.06,
          borderTopRightRadius: 0,
          borderWidth: 9 * s,
          borderColor: "#93C5FD",
          borderRightWidth: 0,
          borderBottomWidth: 0,
        }}
      />
      {/* Right arm */}
      <View
        style={{
          position: "absolute",
          right: size * 0.375,
          top: size * 0.26,
          width: size * 0.06,
          height: size * 0.22,
          borderTopLeftRadius: 0,
          borderTopRightRadius: size * 0.06,
          borderWidth: 9 * s,
          borderColor: "#93C5FD",
          borderLeftWidth: 0,
          borderBottomWidth: 0,
        }}
      />

      {/* ── Padlock body ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.33,
          top: size * 0.44,
          width: size * 0.34,
          height: size * 0.19,
          borderRadius: 14 * s,
          overflow: "hidden",
          borderWidth: 1.8 * s,
          borderColor: "#FFFFFF",
        }}
      >
        <LinearGradient
          colors={["#3B82F6", "#2563EB", "#1D4ED8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        />
        {/* Highlight band */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "35%",
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        />
      </View>

      {/* Keyhole circle */}
      <View
        style={{
          position: "absolute",
          left: size * 0.5 - 5.5 * s,
          top: size * 0.49,
          width: 11 * s,
          height: 11 * s,
          borderRadius: 6 * s,
          backgroundColor: "#FFFFFF",
        }}
      />
      {/* Keyhole stem */}
      <View
        style={{
          position: "absolute",
          left: size * 0.5 - 3.5 * s,
          top: size * 0.495 + 7 * s,
          width: 7 * s,
          height: 10 * s,
          borderRadius: 2 * s,
          backgroundColor: "#FFFFFF",
        }}
      />

      {/* ── Badge cards ── */}
      <BadgeCard
        style={{
          position: "absolute",
          right: size * 0.04,
          top: size * 0.16,
          transform: [{ scale: s }],
          transformOrigin: "top right",
        }}
      />
      <BadgeCard
        style={{
          position: "absolute",
          left: size * 0.04,
          bottom: size * 0.14,
          transform: [{ scale: s }],
          transformOrigin: "bottom left",
        }}
      />
    </View>
  );
}
