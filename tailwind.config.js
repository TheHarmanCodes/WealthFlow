/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0A84FF",
        "primary-soft": "#EBF5FF",
        success: "#30D158",
        "success-soft": "#E8F9ED",
        danger: "#FF453A",
        "danger-soft": "#FFEAEA",
        secondary: "#BF5AF2",
        "secondary-soft": "#F6E8FF",
        warning: "#FF9F0A",
        "warning-soft": "#FFF2E6",
        income: "#30D158",
        "income-soft": "#E8F9ED",
        expense: "#FF453A",
        "expense-soft": "#FFEAEA",
        balance: "#0A84FF",
        savings: "#00C7BE",
        budget: "#FF9F0A",
        ink: "#0B0B1A",
        "ink-muted": "#6B7280",
        "ink-subtle": "#9CA3AF",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F4F5F7",
          dark: "#1C1C1E",
        },
        border: "#E5E7EB",
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.75)",
          border: "rgba(255, 255, 255, 0.85)",
          highlight: "rgba(255, 255, 255, 0.50)",
        },
      },
      fontFamily: {
        jakarta: ["PlusJakartaSans-Regular"],
        "jakarta-medium": ["PlusJakartaSans-Medium"],
        "jakarta-semibold": ["PlusJakartaSans-SemiBold"],
        "jakarta-bold": ["PlusJakartaSans-Bold"],
      },
      borderRadius: {
        card: "28px",
      },
    },
  },
  plugins: [],
};
