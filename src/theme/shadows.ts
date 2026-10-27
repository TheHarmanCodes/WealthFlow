/**
 * WealthFlow Shadows System
 * Modern boxShadow strings compatible with React Native 0.76+ & web.
 */
export const shadows = {
  sm: "0 1px 3px rgba(0, 0, 0, 0.04)",
  card: "0 2px 8px rgba(0, 0, 0, 0.05)",
  raised: "0 4px 16px rgba(0, 0, 0, 0.08)",
  glass: "0 8px 32px rgba(10, 132, 255, 0.12)",
  floating: "0 10px 30px rgba(0, 0, 0, 0.12)",
  glowBlue: "0 0 20px rgba(10, 132, 255, 0.35)",
} as const;

export type ShadowKey = keyof typeof shadows;

