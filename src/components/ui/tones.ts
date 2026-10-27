// Foreground colors shared by Text and UI icons. Pick by meaning, not by hue.
export const tones = {
  ink: "text-ink dark:text-white",
  muted: "text-ink-muted dark:text-slate-400",
  subtle: "text-ink-subtle dark:text-slate-500",
  inverse: "text-white dark:text-ink",
  primary: "text-primary",
  accent: "text-secondary",
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
} as const;

export type Tone = keyof typeof tones;
