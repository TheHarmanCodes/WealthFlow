export interface OnboardingSlideData {
  id: string;
  title: string;
  subtitle: string;
  illustration: "slide1" | "slide2" | "slide3";
}

export const ONBOARDING_SLIDES: readonly OnboardingSlideData[] = [
  {
    id: "welcome",
    title: "Welcome to WealthFlow",
    subtitle:
      "A fast, smart way to track your spending,\ngrow your savings, and secure your\nfuture—effortlessly.",
    illustration: "slide1",
  },
  {
    id: "real-time-tracking",
    title: "Real-Time Tracking",
    subtitle:
      "Understand your money as you spend.\nCategorize transactions instantly and\nsee where it goes with zero effort.",
    illustration: "slide2",
  },
  {
    id: "data-security",
    title: "Your Data is Secure",
    subtitle:
      "Bank-grade encryption keeps your\nfinancial details private and safe, with\nabsolute privacy as our priority.",
    illustration: "slide3",
  },
] as const;
