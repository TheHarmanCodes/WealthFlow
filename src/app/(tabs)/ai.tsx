import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { TabScreenWrapper } from "@/components/navigation/tab-screen-wrapper";
import {
  Sparkles,
  TrendingDown,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  DollarSign,
} from "lucide-react-native";

const insights = [
  {
    id: "1",
    title: "Dining Out Exceeded",
    desc: "You spent $640 on restaurants this month, 22% higher than your target limit.",
    icon: AlertCircle,
    color: "#FF9500",
    action: "Adjust dining budget",
  },
  {
    id: "2",
    title: "Subscription Cleanup Alert",
    desc: "You have 3 recurring streaming services active. Consolidating could save $28/month.",
    icon: Lightbulb,
    color: "#007AFF",
    action: "Review recurring charges",
  },
  {
    id: "3",
    title: "Savings Milestone on Track",
    desc: "Your emergency fund is at 84% completion. At this rate, you will hit $10,000 by next month.",
    icon: CheckCircle2,
    color: "#30D158",
    action: "View savings vault",
  },
  {
    id: "4",
    title: "Lower Utility Costs Observed",
    desc: "Electricity charges dropped 14% compared to October. Good job on optimizing power usage!",
    icon: TrendingDown,
    color: "#30D158",
    action: "See utility trends",
  },
  {
    id: "5",
    title: "High Balance Opportunity",
    desc: "You have $12,400 in checking with 0.05% APY. Transferring to high-yield savings could yield ~$520/yr.",
    icon: DollarSign,
    color: "#AF52DE",
    action: "Explore high-yield vaults",
  },
];

export default function AIScreen() {
  const isDark = useColorScheme() === "dark";

  return (
    <TabScreenWrapper title="AI">
      {/* AI Assistant Hero Card */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: isDark ? "#16181F" : "#FFFFFF",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB",
          },
        ]}
      >
        <View style={styles.heroTopRow}>
          <View style={styles.aiBadge}>
            <Sparkles size={14} color="#007AFF" />
            <Text style={styles.aiBadgeText}>WealthFlow AI Engine</Text>
          </View>
        </View>
        <Text
          style={[
            styles.heroHeading,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          Smart Financial Advisor
        </Text>
        <Text
          style={[
            styles.heroSubtitle,
            { color: isDark ? "#9CA3AF" : "#6B7280" },
          ]}
        >
          Analyzing your cash flow in real-time to surface savings opportunities and risk alerts.
        </Text>
      </View>

      <Text
        style={[
          styles.sectionHeading,
          { color: isDark ? "#FFFFFF" : "#000000" },
        ]}
      >
        Personalized Insights ({insights.length})
      </Text>

      {insights.map((item) => {
        const Icon = item.icon;
        return (
          <View
            key={item.id}
            style={[
              styles.insightCard,
              {
                backgroundColor: isDark ? "#16181F" : "#FFFFFF",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${item.color}1A` },
              ]}
            >
              <Icon size={18} color={item.color} />
            </View>

            <View style={styles.insightContent}>
              <Text
                style={[
                  styles.insightTitle,
                  { color: isDark ? "#FFFFFF" : "#000000" },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.insightDesc,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                {item.desc}
              </Text>
              <Text style={styles.actionText}>{item.action} →</Text>
            </View>
          </View>
        );
      })}
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 122, 255, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  aiBadgeText: {
    color: "#007AFF",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  heroHeading: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans-Regular",
  },
  sectionHeading: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 12,
  },
  insightCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 1,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    color: "#007AFF",
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
