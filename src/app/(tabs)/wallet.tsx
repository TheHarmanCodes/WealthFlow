import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { TabScreenWrapper } from "@/components/navigation/tab-screen-wrapper";
import {
  CreditCard,
  Building2,
  Coins,
  ShieldCheck,
  Plus,
} from "lucide-react-native";

const accounts = [
  {
    id: "1",
    name: "Chase Sapphire Checking",
    type: "Primary Checking",
    balance: "$12,420.50",
    accountNumber: "•••• 4821",
    icon: Building2,
    color: "#007AFF",
  },
  {
    id: "2",
    name: "Marcus High-Yield Savings",
    type: "Emergency Vault (4.8% APY)",
    balance: "$24,500.00",
    accountNumber: "•••• 9140",
    icon: ShieldCheck,
    color: "#30D158",
  },
  {
    id: "3",
    name: "Apple Card Titanium",
    type: "Mastercard Credit",
    balance: "-$1,240.20",
    accountNumber: "•••• 3091",
    icon: CreditCard,
    color: "#FF9500",
  },
  {
    id: "4",
    name: "Fidelity Brokerage Account",
    type: "Index & ETF Holdings",
    balance: "$9,840.00",
    accountNumber: "•••• 7712",
    icon: Building2,
    color: "#5856D6",
  },
  {
    id: "5",
    name: "Cold Storage Crypto Vault",
    type: "BTC & ETH Assets",
    balance: "$3,404.20",
    accountNumber: "Hardware Key",
    icon: Coins,
    color: "#AF52DE",
  },
];

export default function WalletScreen() {
  const isDark = useColorScheme() === "dark";

  return (
    <TabScreenWrapper title="Wallet">
      {/* Total Liquidity Card */}
      <View
        style={[
          styles.liquidityCard,
          {
            backgroundColor: isDark ? "#16181F" : "#FFFFFF",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB",
          },
        ]}
      >
        <Text style={[styles.cardSubtitle, { color: isDark ? "#9CA3AF" : "#6B7280" }]}>
          Total Connected Assets
        </Text>
        <Text style={[styles.cardBalance, { color: isDark ? "#FFFFFF" : "#000000" }]}>
          $48,924.50
        </Text>
        <Text style={styles.syncStatus}>● 5 accounts synced 2 mins ago</Text>
      </View>

      {/* Linked Accounts Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>
          Connected Accounts
        </Text>
        <View style={styles.addAccountPill}>
          <Plus size={14} color="#007AFF" />
          <Text style={styles.addAccountText}>Link Account</Text>
        </View>
      </View>

      {accounts.map((acc) => {
        const Icon = acc.icon;
        return (
          <View
            key={acc.id}
            style={[
              styles.accountRow,
              {
                backgroundColor: isDark ? "#16181F" : "#FFFFFF",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
              },
            ]}
          >
            <View style={[styles.iconWrapper, { backgroundColor: `${acc.color}1A` }]}>
              <Icon size={18} color={acc.color} />
            </View>

            <View style={styles.accountMeta}>
              <Text
                style={[
                  styles.accountName,
                  { color: isDark ? "#FFFFFF" : "#000000" },
                ]}
              >
                {acc.name}
              </Text>
              <Text
                style={[
                  styles.accountType,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                {acc.type} • {acc.accountNumber}
              </Text>
            </View>

            <Text
              style={[
                styles.accountBalance,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {acc.balance}
            </Text>
          </View>
        );
      })}
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  liquidityCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
    elevation: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
  },
  cardBalance: {
    fontSize: 32,
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  syncStatus: {
    fontSize: 12,
    color: "#30D158",
    fontFamily: "PlusJakartaSans-Medium",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
  },
  addAccountPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 122, 255, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addAccountText: {
    color: "#007AFF",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  accountMeta: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  accountType: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 2,
  },
  accountBalance: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Bold",
  },
});
