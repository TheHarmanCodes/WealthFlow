import { Text } from "@/components/ui/text";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { View, useColorScheme } from "react-native";

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

const WEALTHFLOW_LOGO_URL =
  "https://ik.imagekit.io/tvaz27dnm/wealthflow_logo.png";

export function AuthHeader({
  title,
  subtitle,
  showLogo = true,
}: AuthHeaderProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="items-center mb-5 sm:mb-6">
      {showLogo && (
        <View className="flex-row items-center justify-center gap-2.5 mb-4">
          <View className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl items-center justify-center">
            <Image
              source={{ uri: WEALTHFLOW_LOGO_URL }}
              style={{ width: 40, height: 40 }}
              contentFit="contain"
              transition={200}
              accessibilityLabel="WealthFlow Logo"
            />
          </View>
          <View>
            <Text
              style={{ color: isDark ? "#FFFFFF" : "#0B0B1A" }}
              className="font-jakarta-bold text-xl sm:text-2xl tracking-tight leading-none"
            >
              WealthFlow
            </Text>
            <View>
              <MaskedView
                style={{ alignSelf: "flex-start" }}
                maskElement={
                  <Text
                    className="text-[11px] sm:text-xs font-jakarta-semibold tracking-wide mt-1"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Your financial life
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#ff6f3a", "#ff9d01", "#fac971"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text
                    className="text-[11px] sm:text-xs font-jakarta-semibold tracking-wide mt-1"
                    style={{ opacity: 0 }}
                  >
                    Your financial life
                  </Text>
                </LinearGradient>
              </MaskedView>
            </View>
          </View>
        </View>
      )}

      {title && (
        <Text
          variant="heading"
          style={{ color: isDark ? "#FFFFFF" : "#0B0B1A" }}
          className="text-xl sm:text-3xl font-medium font-jakarta-bold text-center mb-1"
        >
          {title}
        </Text>
      )}

      {subtitle && (
        <Text
          style={{ color: isDark ? "#94A3B8" : "#7a8491" }}
          className="text-sm sm:text-xs font-jakarta text-center max-w-[320px] leading-relaxed"
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
