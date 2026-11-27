import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { TabScreenWrapper } from "@/components/navigation/tab-screen-wrapper";
import {
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Film,
  HeartPulse,
  Briefcase,
  Zap,
} from "lucide-react-native";

const categories = [
  { name: "Housing & Rent", amount: "$1,850.00", percentage: "38%", icon: Home, color: "#007AFF" },
  { name: "Food & Dining", amount: "$640.20", percentage: "13%", icon: Utensils, color: "#FF9500" },
  { name: "Groceries", amount: "$520.10", percentage: "11%", icon: ShoppingBag, color: "#30D158" },
  { name: "Transportation", amount: "$380.00", percentage: "8%", icon: Car, color: "#5856D6" },
  { name: "Entertainment", amount: "$240.50", percentage: "5%", icon: Film, color: "#AF52DE" },
  { name: "Healthcare & Gym", amount: "$195.00", percentage: "4%", icon: HeartPulse, color: "#FF2D55" },
  { name: "Business & Work", amount: "$160.00", percentage: "3%", icon: Briefcase, color: "#00C7BE" },
  { name: "Utilities & Bills", amount: "$210.00", percentage: "4%", icon: Zap, color: "#FFCC00" },
];

export default function StatsScreen() {
  const isDark = useColorScheme() === "dark";

  return (
    <TabScreenWrapper title="Stats">
      {/* Monthly Summary Card */}
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: isDark ? "#16181F" : "#FFFFFF",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB",
          },
        ]}
      >
        <Text style={[styles.subLabel, { color: isDark ? "#9CA3AF" : "#6B7280" }]}>
          Total Expenses this Month
        </Text>
        <Text style={[styles.mainFigure, { color: isDark ? "#FFFFFF" : "#000000" }]}>
          $4,195.80
        </Text>
        <Text style={styles.savingsNote}>↓ 4.2% less than last month</Text>
      </View>

      {/* Categories Breakdown */}
      <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>
        Spending by Category
      </Text>

      {categories.map((cat, idx) => {
        const Icon = cat.icon;
        return (
          <View
            key={idx}
            style={[
              styles.categoryRow,
              {
                backgroundColor: isDark ? "#16181F" : "#FFFFFF",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
              },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: `${cat.color}1A` }]}>
              <Icon size={18} color={cat.color} />
            </View>

            <View style={styles.categoryInfo}>
              <Text
                style={[
                  styles.categoryName,
                  { color: isDark ? "#FFFFFF" : "#000000" },
                ]}
              >
                {cat.name}
              </Text>
              <Text
                style={[
                  styles.categoryPercent,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                {cat.percentage} of monthly spend
              </Text>
            </View>

            <Text
              style={[
                styles.categoryAmount,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {cat.amount}
            </Text>
          </View>
        );
      })}
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
    elevation: 2,
  },
  subLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
  },
  mainFigure: {
    fontSize: 32,
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  savingsNote: {
    color: "#30D158",
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  categoryPercent: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 2,
  },
  categoryAmount: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Bold",
  },
});
