import { TextStyle } from "react-native";
import { colors } from "./colors";

export const fontFamilies = {
  regular: "PlusJakartaSans-Regular",
  medium: "PlusJakartaSans-Medium",
  semiBold: "PlusJakartaSans-SemiBold",
  bold: "PlusJakartaSans-Bold",
} as const;

/**
 * WealthFlow Typography Ramp
 * Plus Jakarta Sans type definitions.
 */
export const typography = {
  display: {
    fontFamily: fontFamilies.bold,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "700",
    color: colors.text,
  },
  heading: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "600",
    color: colors.text,
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600",
    color: colors.text,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
    color: colors.text,
  },
  subhead: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  button: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
