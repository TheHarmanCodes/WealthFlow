/**
 * WealthFlow Color Palette
 * Derived directly from the WealthFlow visual design specification.
 */
export const palette = {
  // Brand accents
  primaryBlue: "#0A84FF",
  successGreen: "#30D158",
  dangerRed: "#FF453A",
  secondaryPurple: "#BF5AF2",
  warningOrange: "#FF9F0A",

  // Pure Neutrals
  white: "#FFFFFF",
  black: "#000000",

  // Surfaces
  surfaceLight: "#FFFFFF",
  surfaceDark: "#1C1C1E",
  surfaceLightSubtle: "#F2F2F7",
  surfaceDarkSubtle: "#2C2C2E",

  // Backgrounds
  bgLight: "#F2F2F7",
  bgDark: "#000000",

  // Text
  textPrimaryLight: "#000000",
  textPrimaryDark: "#FFFFFF",
  textSecondaryLight: "#8E8E93",
  textSecondaryDark: "#98989D",
  textMutedLight: "#C7C7CC",
  textMutedDark: "#48484A",

  // Borders & Separators
  borderLight: "#E5E5EA",
  borderDark: "#38383A",

  // Glass tokens
  glassBlurLight: "rgba(255, 255, 255, 0.4)",
  glassBlurDark: "rgba(28, 28, 30, 0.65)",
  glassBorderLight: "rgba(255, 255, 255, 0.6)",
  glassBorderDark: "rgba(255, 255, 255, 0.15)",
  glassHighlight: "rgba(255, 255, 255, 0.25)",

  // Category soft pastels (for badges)
  pastelGreen: "#E8F9ED",
  pastelBlue: "#E8F3FF",
  pastelPurple: "#F6E8FF",
  pastelRed: "#FFEAEA",
  pastelOrange: "#FFF2E6",
  pastelTeal: "#E6F8F7",
} as const;

/**
 * Static-safe semantic colors mapping to the active interface style
 */
export const colors = {
  primary: palette.primaryBlue,
  success: palette.successGreen,
  danger: palette.dangerRed,
  secondary: palette.secondaryPurple,
  warning: palette.warningOrange,

  // Semantic surfaces
  surface: palette.surfaceLight,
  surfaceDark: palette.surfaceDark,
  surfaceSubtle: palette.surfaceLightSubtle,

  // Text
  text: palette.textPrimaryLight,
  textSecondary: palette.textSecondaryLight,
  textMuted: palette.textMutedLight,

  // Borders & dividers
  border: palette.borderLight,

  // Glass
  glass: {
    background: palette.glassBlurLight,
    border: palette.glassBorderLight,
    darkBackground: palette.glassBlurDark,
    darkBorder: palette.glassBorderDark,
    highlight: palette.glassHighlight,
  },

  // Deliberately fixed
  onPrimary: palette.white,
  onTint: palette.white,
} as const;
