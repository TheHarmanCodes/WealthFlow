/**
 * Slide1Illustration — Piggy Bank with floating coins.
 *
 * Built entirely with View + expo-linear-gradient + Text.
 * Zero react-native-svg — avoids the Fabric/Android blank render bug
 * in react-native-svg 15.x on RN 0.86 New Architecture.
 *
 * Apple-style: soft radial glow, rounded shapes, pastel palette.
 */
import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export interface IllustrationProps {
  size?: number;
}

export function Slide1Illustration({ size = 280 }: IllustrationProps) {
  const s = size / 280; // scale factor

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityLabel="Piggy bank with floating coins illustration"
      accessibilityRole="image"
    >
      {/* Radial ambient glow */}
      <LinearGradient
        colors={["rgba(52,211,153,0.35)", "rgba(14,165,233,0.22)", "transparent"]}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />

      {/* ── Body of piggy bank ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.25,
          top: size * 0.38,
          width: size * 0.52,
          height: size * 0.46,
          borderRadius: size * 0.26,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["#BAE6FD", "#7DD3FC", "#38BDF8"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Specular highlight on body */}
      <View
        style={{
          position: "absolute",
          left: size * 0.28,
          top: size * 0.4,
          width: size * 0.2,
          height: size * 0.12,
          borderRadius: size * 0.1,
          backgroundColor: "rgba(255,255,255,0.65)",
          transform: [{ rotate: "-18deg" }],
        }}
      />

      {/* ── Snout ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.14,
          top: size * 0.54,
          width: size * 0.2,
          height: size * 0.13,
          borderRadius: size * 0.065,
          backgroundColor: "#BAE6FD",
          borderWidth: 1.5 * s,
          borderColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: size * 0.04,
        }}
      >
        <View
          style={{
            width: size * 0.04,
            height: size * 0.04,
            borderRadius: size * 0.02,
            backgroundColor: "#0284C7",
          }}
        />
        <View
          style={{
            width: size * 0.04,
            height: size * 0.04,
            borderRadius: size * 0.02,
            backgroundColor: "#0284C7",
          }}
        />
      </View>

      {/* ── Ear ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.33,
          top: size * 0.3,
          width: size * 0.13,
          height: size * 0.14,
          borderRadius: size * 0.07,
          backgroundColor: "#38BDF8",
          transform: [{ rotate: "10deg" }],
        }}
      />

      {/* ── Eye ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.31,
          top: size * 0.5,
          width: size * 0.045,
          height: size * 0.045,
          borderRadius: size * 0.025,
          backgroundColor: "#0F172A",
        }}
      />
      {/* Eye shine */}
      <View
        style={{
          position: "absolute",
          left: size * 0.315,
          top: size * 0.5,
          width: size * 0.018,
          height: size * 0.018,
          borderRadius: size * 0.01,
          backgroundColor: "#FFFFFF",
        }}
      />

      {/* ── Tail (squiggle) ── */}
      <View
        style={{
          position: "absolute",
          right: size * 0.11,
          top: size * 0.52,
          width: size * 0.08,
          height: size * 0.06,
          borderRadius: size * 0.03,
          borderWidth: 3 * s,
          borderColor: "#38BDF8",
          borderLeftWidth: 0,
          borderBottomWidth: 0,
          transform: [{ rotate: "30deg" }],
        }}
      />

      {/* ── Front-left leg ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.27,
          top: size * 0.74,
          width: size * 0.1,
          height: size * 0.14,
          borderRadius: size * 0.05,
          backgroundColor: "#38BDF8",
          borderWidth: 1.5 * s,
          borderColor: "#FFFFFF",
        }}
      />
      {/* ── Front-right leg ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.63,
          top: size * 0.74,
          width: size * 0.1,
          height: size * 0.14,
          borderRadius: size * 0.05,
          backgroundColor: "#38BDF8",
          borderWidth: 1.5 * s,
          borderColor: "#FFFFFF",
        }}
      />

      {/* ── Floor shadow ── */}
      <View
        style={{
          position: "absolute",
          left: size * 0.2,
          bottom: size * 0.02,
          width: size * 0.6,
          height: size * 0.05,
          borderRadius: size * 0.025,
          backgroundColor: "rgba(15,23,42,0.1)",
        }}
      />

      {/* ══ Floating coins ══ */}

      {/* Coin: Blue top-right */}
      <View
        style={{
          position: "absolute",
          right: size * 0.1,
          top: size * 0.1,
          width: size * 0.15,
          height: size * 0.15,
          borderRadius: size * 0.075,
          backgroundColor: "#3B82F6",
          borderWidth: 2 * s,
          borderColor: "#DBEAFE",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 12 * s, color: "#FFFFFF", fontWeight: "800" }}>₹</Text>
      </View>

      {/* Coin: Green top-center ($) */}
      <View
        style={{
          position: "absolute",
          left: size * 0.39,
          top: size * 0.1,
          width: size * 0.17,
          height: size * 0.17,
          borderRadius: size * 0.085,
          backgroundColor: "#34D399",
          borderWidth: 2.5 * s,
          borderColor: "#D1FAE5",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 13 * s, color: "#FFFFFF", fontWeight: "900" }}>$</Text>
      </View>

      {/* Coin: Cyan middle */}
      <View
        style={{
          position: "absolute",
          right: size * 0.2,
          top: size * 0.28,
          width: size * 0.13,
          height: size * 0.13,
          borderRadius: size * 0.065,
          backgroundColor: "#22D3EE",
          borderWidth: 2 * s,
          borderColor: "#E0F2FE",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 10 * s, color: "#FFFFFF", fontWeight: "800" }}>₹</Text>
      </View>

      {/* Coin: Green left */}
      <View
        style={{
          position: "absolute",
          left: size * 0.08,
          top: size * 0.25,
          width: size * 0.12,
          height: size * 0.12,
          borderRadius: size * 0.06,
          backgroundColor: "#34D399",
          borderWidth: 2 * s,
          borderColor: "#D1FAE5",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 10 * s, color: "#FFFFFF", fontWeight: "800" }}>$</Text>
      </View>

      {/* ── Sparkles (4-point star using rotated squares) ── */}
      {/* Sparkle 1 — top-right */}
      <View
        style={{
          position: "absolute",
          right: size * 0.07,
          top: size * 0.3,
          width: size * 0.06,
          height: size * 0.06,
          transform: [{ rotate: "45deg" }],
        }}
      >
        <View
          style={{
            width: size * 0.03,
            height: size * 0.03,
            backgroundColor: "#34D399",
            borderRadius: 1,
            margin: size * 0.015,
            transform: [{ scaleX: 3 }],
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: size * 0.015,
            width: size * 0.03,
            height: size * 0.06,
            backgroundColor: "#34D399",
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: size * 0.015,
            left: 0,
            width: size * 0.06,
            height: size * 0.03,
            backgroundColor: "#34D399",
            borderRadius: 2,
          }}
        />
      </View>

      {/* Sparkle 2 — left */}
      <View
        style={{
          position: "absolute",
          left: size * 0.06,
          top: size * 0.18,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: size * 0.018,
            width: size * 0.025,
            height: size * 0.07,
            backgroundColor: "#38BDF8",
            borderRadius: 3,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: size * 0.02,
            left: 0,
            width: size * 0.06,
            height: size * 0.025,
            backgroundColor: "#38BDF8",
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );
}
