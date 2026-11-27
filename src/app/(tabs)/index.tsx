import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { TabScreenWrapper } from "@/components/navigation/tab-screen-wrapper";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Utensils,
  Car,
  Wifi,
  Film,
} from "lucide-react-native";

const sampleTransactions = [
  {
    id: "1",
    title: "Monthly Salary",
    category: "Income",
    amount: "+$5,400.00",
    date: "Today, 10:30 AM",
    isPositive: true,
    icon: ArrowDownLeft,
  },
  {
    id: "2",
    title: "Whole Foods Market",
    category: "Groceries",
    amount: "-$142.50",
    date: "Yesterday",
    isPositive: false,
    icon: ShoppingBag,
  },
  {
    id: "3",
    title: "Blue Bottle Coffee",
    category: "Dining",
    amount: "-$6.75",
    date: "Yesterday",
    isPositive: false,
    icon: Utensils,
  },
  {
    id: "4",
    title: "Uber Ride",
    category: "Transport",
    amount: "-$24.80",
    date: "Nov 11",
    isPositive: false,
    icon: Car,
  },
  {
    id: "5",
    title: "Stock Dividend",
    category: "Investment",
    amount: "+$85.20",
    date: "Nov 10",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    id: "6",
    title: "Netflix Subscription",
    category: "Entertainment",
    amount: "-$19.99",
    date: "Nov 09",
    isPositive: false,
    icon: Film,
  },
  {
    id: "7",
    title: "High-Speed Internet",
    category: "Utilities",
    amount: "-$79.00",
    date: "Nov 08",
    isPositive: false,
    icon: Wifi,
  },
  {
    id: "8",
    title: "Apple Store",
    category: "Electronics",
    amount: "-$349.00",
    date: "Nov 05",
    isPositive: false,
    icon: CreditCard,
  },
  {
    id: "9",
    title: "Freelance Design",
    category: "Income",
    amount: "+$850.00",
    date: "Nov 03",
    isPositive: true,
    icon: ArrowDownLeft,
  },
  {
    id: "10",
    title: "Gym Membership",
    category: "Health",
    amount: "-$65.00",
    date: "Nov 01",
    isPositive: false,
    icon: ArrowUpRight,
  },
];

export default function HomeScreen() {
  const isDark = useColorScheme() === "dark";

  return (
    <TabScreenWrapper title="Home">
      {/* Balance Overview Card */}
      <View
        style={[
          styles.balanceCard,
          {
            backgroundColor: isDark ? "#16181F" : "#FFFFFF",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB",
          },
        ]}
      >
        <Text
          style={[
            styles.balanceSubtitle,
            { color: isDark ? "#9CA3AF" : "#6B7280" },
          ]}
        >
          Total Net Worth
        </Text>
        <Text
          style={[
            styles.balanceAmount,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          $48,924.50
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.trendBadge}>
            <TrendingUp size={14} color="#30D158" />
            <Text style={styles.trendText}>+12.4% this month</Text>
          </View>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          Recent Transactions
        </Text>
        <Text style={styles.sectionLink}>View All</Text>
      </View>

      {/* Scrollable Transaction Items */}
      {sampleTransactions.map((tx) => {
        const Icon = tx.icon;
        return (
          <View
            key={tx.id}
            style={[
              styles.txCard,
              {
                backgroundColor: isDark ? "#16181F" : "#FFFFFF",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
              },
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: tx.isPositive
                    ? "rgba(48, 209, 88, 0.12)"
                    : isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "#F3F4F6",
                },
              ]}
            >
              <Icon
                size={18}
                color={
                  tx.isPositive
                    ? "#30D158"
                    : isDark
                      ? "#FFFFFF"
                      : "#1F2937"
                }
              />
            </View>

            <View style={styles.txMeta}>
              <Text
                style={[
                  styles.txTitle,
                  { color: isDark ? "#FFFFFF" : "#000000" },
                ]}
              >
                {tx.title}
              </Text>
              <Text
                style={[
                  styles.txDate,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                {tx.date} • {tx.category}
              </Text>
            </View>

            <Text
              style={[
                styles.txAmount,
                { color: tx.isPositive ? "#30D158" : isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {tx.amount}
            </Text>
          </View>
        );
      })}
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  balanceSubtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 34,
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: -1,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(48, 209, 88, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    color: "#30D158",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
  },
  sectionLink: {
    fontSize: 13,
    color: "#007AFF",
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  txCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  txMeta: {
    flex: 1,
  },
  txTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  txDate: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Bold",
  },
});
