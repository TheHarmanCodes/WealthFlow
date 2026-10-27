import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { TrendingDown, TrendingUp } from "lucide-react-native";
import { View } from "react-native";

export interface BalanceCardProps {
  totalBalance?: string;
  incomeAmount?: string;
  expenseAmount?: string;
  className?: string;
  tint?: "light" | "dark";
  showGlint?: boolean;
}

export function BalanceCard({
  totalBalance = "$0.00",
  incomeAmount = "$0.00",
  expenseAmount = "$0.00",
  className,
  tint = "light",
  showGlint = true,
}: BalanceCardProps) {
  const isDark = tint === "dark";
  const iconColor = isDark ? "#FFFFFF" : "#0B0B1A";

  return (
    <View className={cn("relative w-full", className)}>
      <GlassCard
        tint={tint}
        className="w-full relative overflow-hidden"
        contentClassName="p-6"
      >
        {/* Top Header Section */}
        <View className="gap-1">
          <Text
            variant="lead"
            tone="muted"
            className={cn(
              "text-[17px] font-jakarta-medium",
              isDark && "text-white/70",
            )}
          >
            Total Balance
          </Text>
          <Text
            variant="display"
            tone="ink"
            className={cn(
              "text-[42px] font-jakarta-bold tracking-tight mt-1",
              isDark && "text-white",
            )}
          >
            {totalBalance}
          </Text>
        </View>

        {/* Bottom Income & Expense Row */}
        <View className="flex-row items-center justify-between mt-6 pt-2">
          {/* Income Column */}
          <View className="flex-row items-center gap-3 flex-1">
            <View className="items-center justify-center">
              <TrendingUp size={24} color={iconColor} strokeWidth={2.5} />
            </View>
            <View>
              <Text
                variant="subhead"
                tone="muted"
                className={cn(
                  "text-sm font-jakarta-medium",
                  isDark && "text-white/70",
                )}
              >
                Income ⌃
              </Text>
              <Text
                variant="title"
                tone="ink"
                className={cn(
                  "text-[20px] font-jakarta-bold tracking-tight mt-0.5",
                  isDark && "text-white",
                )}
              >
                {incomeAmount}
              </Text>
            </View>
          </View>

          {/* Expense Column */}
          <View className="flex-row items-center gap-3 flex-1 justify-end">
            <View className="items-center justify-center">
              <TrendingDown size={24} color={iconColor} strokeWidth={2.5} />
            </View>
            <View>
              <Text
                variant="subhead"
                tone="muted"
                className={cn(
                  "text-sm font-jakarta-medium",
                  isDark && "text-white/70",
                )}
              >
                Expense ⌄
              </Text>
              <Text
                variant="title"
                tone="ink"
                className={cn(
                  "text-[20px] font-jakarta-bold tracking-tight mt-0.5",
                  isDark && "text-white",
                )}
              >
                {expenseAmount}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}
