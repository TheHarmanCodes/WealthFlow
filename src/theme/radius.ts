/**
 * WealthFlow Radius System
 * Squircle/continuous corner radii for Apple-style rounded cards and capsules.
 */
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  card: 22,
  "2xl": 24,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radius;

