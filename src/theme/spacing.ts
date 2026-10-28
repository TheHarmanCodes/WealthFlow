/**
 * WealthFlow Spacing System
 * Strict 4-point grid following expo-design-system principles.
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16, // Default screen & card interior padding
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export type SpacingKey = keyof typeof spacing;

