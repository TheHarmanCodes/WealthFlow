import { cn } from "@/lib/cn";
import {
  Text as RNText,
  useColorScheme,
  type TextProps as RNTextProps,
} from "react-native";
import { tones, type Tone } from "./tones";

export const textVariants = {
  display: "font-jakarta-bold text-display tracking-tight",
  heading: "font-jakarta-semibold text-heading",
  title: "font-jakarta-semibold text-title",
  body: "font-jakarta text-body",
  lead: "font-jakarta-medium text-lead",
  subhead: "font-jakarta-medium text-subhead",
  caption: "font-jakarta text-caption",
  footnote: "font-jakarta-medium text-footnote",
  button: "font-jakarta-semibold text-button",
} as const;

export type TextVariant = keyof typeof textVariants;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: Tone;
  className?: string;
};

export function Text({
  variant = "body",
  tone,
  className,
  style,
  ...props
}: TextProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <RNText
      className={cn(
        textVariants[variant],
        tone ? tones[tone] : isDark ? "text-white" : "text-ink",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

// Export ThemedText alias for drop-in compatibility across the app
export const ThemedText = Text;
