/**
 * WealthFlow Motion Tokens
 * Standard durations and easing curves for smooth responsive feedback.
 */
export const motion = {
  fast: 150, // touch feedback, toggle transitions
  base: 250, // modal sheets, element reveals
  slow: 400, // screen transitions
} as const;

export type MotionKey = keyof typeof motion;

