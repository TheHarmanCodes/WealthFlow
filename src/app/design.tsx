import React, { useState } from "react";
import { ScrollView, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  Plus,
  ChevronRight,
  Settings,
  Search,
  Edit3,
  Gift,
  ShoppingBag,
  Car,
  Wrench,
  Heart,
  RefreshCw,
  Film,
  Gamepad2,
  Utensils,
  Landmark,
  MoreHorizontal,
  ScanLine,
  LogOut,
} from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, SearchInput } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CategoryIconBadge } from "@/components/ui/badge";
import { ToastAlert } from "@/components/ui/toast-alert";
import {
  LiquidGlassTabBar,
  type TabKey,
  type TabBarMode,
} from "@/components/ui/liquid-tab-bar";
import { BalanceCard } from "@/components/finance/balance-card";
import { TransactionItem } from "@/components/finance/transaction-item";

import { useRouter } from "expo-router";
import { setMockSignedIn } from "@/lib/auth-mock";
import { resetOnboarding } from "@/lib/onboarding";

export default function DesignSystemScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Weekly");
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [tabBarMode, setTabBarMode] = useState<TabBarMode>("floating");
  const [searchValue, setSearchValue] = useState("");
  const [amountValue, setAmountValue] = useState("");

  const handleLogout = async () => {
    await setMockSignedIn(false);
    await resetOnboarding();
    router.replace("/onboarding");
  };

  const periodOptions = [
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "All Transactions", value: "All" },
  ];

  const tabModeOptions = [
    { label: "Floating", value: "floating" },
    { label: "Light", value: "light" },
    { label: "Glass", value: "glass" },
    { label: "Dark", value: "dark" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F7]">
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Bar / Logout for Testing */}
        <View className="flex-row items-center justify-between bg-white p-3.5 rounded-2xl border border-border">
          <View>
            <Text variant="caption" tone="muted" className="font-jakarta-medium text-[11px] uppercase tracking-wider">
              Route: /design
            </Text>
            <Text variant="title" tone="ink" className="font-jakarta-bold text-[16px]">
              Design System Screen
            </Text>
          </View>
          <Button
            title="Log Out"
            variant="ghost"
            size="sm"
            onPress={handleLogout}
            icon={<LogOut size={15} color="#0A84FF" />}
            accessibilityLabel="Log out to onboarding"
          />
        </View>

        {/* 01. Brand & Typography */}
        <View className="gap-2.5">
          <Text
            variant="caption"
            tone="primary"
            className="font-jakarta-bold uppercase tracking-wider text-[11px]"
          >
            01. Brand & Typography (Plus Jakarta Sans)
          </Text>
          <View className="gap-0.5">
            <Text
              variant="display"
              tone="ink"
              className="font-jakarta-bold tracking-tight text-[34px]"
            >
              WealthFlow
            </Text>
            <Text variant="body" tone="muted" className="font-jakarta">
              Your Personal Finance Companion
            </Text>
          </View>

          <Card className="gap-2 p-4">
            <Text variant="display" tone="ink" className="text-[30px] tracking-tight">
              Jakarta Bold (30px)
            </Text>
            <Text variant="heading" tone="ink">
              Heading (24px, Semi-Bold)
            </Text>
            <Text variant="title" tone="ink">
              Title (20px, Semi-Bold)
            </Text>
            <Text variant="body" tone="ink">
              Body (16px, Regular)
            </Text>
            <Text variant="subhead" tone="muted">
              Subhead (14px, Medium)
            </Text>
            <Text variant="caption" tone="subtle">
              Caption (12px, Regular)
            </Text>
          </Card>
        </View>

        {/* 02. Color Palette */}
        <View className="gap-2.5">
          <Text
            variant="caption"
            tone="primary"
            className="font-jakarta-bold uppercase tracking-wider text-[11px]"
          >
            02. Color Palette (Tailwind Tokens)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="w-[30%] min-w-[95px] items-center bg-surface p-2.5 rounded-2xl gap-1 border border-border/40">
              <View className="w-full h-10 rounded-xl bg-primary" />
              <Text variant="caption" tone="ink" className="font-jakarta-semibold mt-0.5">
                Primary Blue
              </Text>
              <Text variant="caption" tone="subtle" className="text-[10px]">
                #0A84FF
              </Text>
            </View>

            <View className="w-[30%] min-w-[95px] items-center bg-surface p-2.5 rounded-2xl gap-1 border border-border/40">
              <View className="w-full h-10 rounded-xl bg-success" />
              <Text variant="caption" tone="ink" className="font-jakarta-semibold mt-0.5">
                Success Green
              </Text>
              <Text variant="caption" tone="subtle" className="text-[10px]">
                #30D158
              </Text>
            </View>

            <View className="w-[30%] min-w-[95px] items-center bg-surface p-2.5 rounded-2xl gap-1 border border-border/40">
              <View className="w-full h-10 rounded-xl bg-danger" />
              <Text variant="caption" tone="ink" className="font-jakarta-semibold mt-0.5">
                Danger Red
              </Text>
              <Text variant="caption" tone="subtle" className="text-[10px]">
                #FF453A
              </Text>
            </View>

            <View className="w-[30%] min-w-[95px] items-center bg-surface p-2.5 rounded-2xl gap-1 border border-border/40">
              <View className="w-full h-10 rounded-xl bg-secondary" />
              <Text variant="caption" tone="ink" className="font-jakarta-semibold mt-0.5">
                Secondary Purp
              </Text>
              <Text variant="caption" tone="subtle" className="text-[10px]">
                #BF5AF2
              </Text>
            </View>

            <View className="w-[30%] min-w-[95px] items-center bg-surface p-2.5 rounded-2xl gap-1 border border-border/40">
              <View className="w-full h-10 rounded-xl bg-white/70 border border-border shadow-sm" />
              <Text variant="caption" tone="ink" className="font-jakarta-semibold mt-0.5">
                Glass Blur
              </Text>
              <Text variant="caption" tone="subtle" className="text-[10px]">
                rgba(255,255,255,0.7)
              </Text>
            </View>

            <View className="w-[30%] min-w-[95px] items-center bg-surface p-2.5 rounded-2xl gap-1 border border-border/40">
              <View className="w-full h-10 rounded-xl bg-surface-dark" />
              <Text variant="caption" tone="ink" className="font-jakarta-semibold mt-0.5">
                Surface Dark
              </Text>
              <Text variant="caption" tone="subtle" className="text-[10px]">
                #1C1C1E
              </Text>
            </View>
          </View>
        </View>

        {/* 03. Interactive Cards (Apple UI inspired) */}
        <View className="gap-2.5">
          <Text
            variant="caption"
            tone="primary"
            className="font-jakarta-bold uppercase tracking-wider text-[11px]"
          >
            03. Interactive Cards (Recreated Apple UI)
          </Text>

          {/* Newly Recreated Apple-Glass Balance Card */}
          <BalanceCard
            totalBalance="$223,876"
            incomeAmount="$223,876"
            expenseAmount="$50,000"
          />

          {/* Transaction List */}
          <View className="gap-2 mt-1">
            <TransactionItem
              icon={<Film size={20} color="#30D158" />}
              theme="green"
              title="Entertainment"
              subtitle="Movies at the Moil"
              amount="-$120"
              timestamp="10:00 AM"
            />

            <TransactionItem
              icon={<Gamepad2 size={20} color="#0A84FF" />}
              theme="blue"
              title="Play Station"
              amount="-$120"
              progress={{
                value: 80,
                leftLabel: "Saved $2,200 / 80%",
                rightLabel: "left $1,000 / 80%",
              }}
            />

            <TransactionItem
              icon={<Utensils size={20} color="#BF5AF2" />}
              theme="purple"
              title="Food"
              subtitle="Last Transaction · Mon July 7"
              amount="-$42"
              timestamp="$250 limit"
            />

            <TransactionItem
              icon={<Landmark size={20} color="#30D158" />}
              theme="teal"
              title="Salary"
              subtitle="Main Income"
              amount="+$9,020"
              isIncome
              timestamp="08:00 PM"
            />
          </View>
        </View>

        {/* 04. Buttons & Input Fields (shadcn inspired) */}
        <View className="gap-2.5">
          <Text
            variant="caption"
            tone="primary"
            className="font-jakarta-bold uppercase tracking-wider text-[11px]"
          >
            04. Buttons & Input Fields (Tailwind)
          </Text>

          <View className="flex-row items-center flex-wrap gap-2">
            <Button title="Add Transaction" variant="primary" />
            <Button title="Cancel" variant="secondary" />
            <Button
              variant="secondary"
              size="icon"
              icon={<MoreHorizontal size={20} color="#0B0B1A" />}
            />
          </View>

          <View className="flex-row items-center flex-wrap gap-2">
            <Button
              variant="icon"
              size="icon"
              icon={<Plus size={20} color="#0A84FF" />}
            />
            <Button
              variant="icon"
              size="icon"
              icon={<Gift size={20} color="#0A84FF" />}
            />
            <Button
              variant="icon"
              size="icon"
              icon={<Search size={20} color="#0A84FF" />}
            />
            <Button
              variant="icon"
              size="icon"
              icon={<ScanLine size={20} color="#0A84FF" />}
            />
          </View>

          <SearchInput
            placeholder="Search"
            value={searchValue}
            onChangeText={setSearchValue}
            onClear={() => setSearchValue("")}
          />

          <View className="flex-row gap-2">
            <View className="flex-1">
              <Input
                placeholder="Amount"
                value={amountValue}
                onChangeText={setAmountValue}
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Input placeholder="Amount" keyboardType="numeric" />
            </View>
          </View>

          <SegmentedControl
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            scrollable
          />
        </View>

        {/* 05. Navigation (Apple Liquid-glass Tab Bar) */}
        <View className="gap-2.5">
          <Text
            variant="caption"
            tone="primary"
            className="font-jakarta-bold uppercase tracking-wider text-[11px]"
          >
            05. Navigation (Apple Liquid-glass Tab Bar)
          </Text>

          <Text variant="subhead" tone="muted">
            Select Tab Bar Mode:
          </Text>
          <SegmentedControl
            options={tabModeOptions}
            value={tabBarMode}
            onChange={(m) => setTabBarMode(m as TabBarMode)}
          />

          <View className="py-4 px-2 bg-[#E5E5EA] rounded-3xl items-center justify-center">
            <LiquidGlassTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              mode={tabBarMode}
            />
          </View>
        </View>

        {/* 06. Icons (Lucide-inspired) */}
        <View className="gap-2.5">
          <Text
            variant="caption"
            tone="primary"
            className="font-jakarta-bold uppercase tracking-wider text-[11px]"
          >
            06. Icons (Lucide-inspired)
          </Text>

          <Text variant="subhead" tone="ink" className="font-jakarta-semibold">
            Utility
          </Text>
          <View className="flex-row items-center justify-between flex-wrap gap-2">
            <View className="items-center gap-1 min-w-[48px]">
              <View className="w-11 h-11 rounded-2xl bg-primary-soft items-center justify-center">
                <Bell size={20} color="#0A84FF" />
              </View>
              <Text variant="caption" tone="muted">
                Bell
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <View className="w-11 h-11 rounded-2xl bg-primary-soft items-center justify-center">
                <Plus size={20} color="#0A84FF" />
              </View>
              <Text variant="caption" tone="muted">
                Plus
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <View className="w-11 h-11 rounded-2xl bg-primary-soft items-center justify-center">
                <ChevronRight size={20} color="#0A84FF" />
              </View>
              <Text variant="caption" tone="muted">
                Chevron
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <View className="w-11 h-11 rounded-2xl bg-primary-soft items-center justify-center">
                <Settings size={20} color="#0A84FF" />
              </View>
              <Text variant="caption" tone="muted">
                Settings
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <View className="w-11 h-11 rounded-2xl bg-primary-soft items-center justify-center">
                <Search size={20} color="#0A84FF" />
              </View>
              <Text variant="caption" tone="muted">
                Search
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <View className="w-11 h-11 rounded-2xl bg-primary-soft items-center justify-center">
                <Edit3 size={20} color="#0A84FF" />
              </View>
              <Text variant="caption" tone="muted">
                Edit
              </Text>
            </View>
          </View>

          <Text variant="subhead" tone="ink" className="font-jakarta-semibold mt-1">
            Category Icons
          </Text>
          <View className="flex-row items-center justify-between flex-wrap gap-2">
            <View className="items-center gap-1 min-w-[48px]">
              <CategoryIconBadge
                icon={<Gift size={20} color="#FF9F0A" />}
                theme="orange"
              />
              <Text variant="caption" tone="muted">
                Gift
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <CategoryIconBadge
                icon={<ShoppingBag size={20} color="#FF453A" />}
                theme="red"
              />
              <Text variant="caption" tone="muted">
                Shopping
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <CategoryIconBadge
                icon={<Car size={20} color="#FF453A" />}
                theme="red"
              />
              <Text variant="caption" tone="muted">
                Car
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <CategoryIconBadge
                icon={<Wrench size={20} color="#BF5AF2" />}
                theme="purple"
              />
              <Text variant="caption" tone="muted">
                Utilities
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <CategoryIconBadge
                icon={<Heart size={20} color="#FF375F" />}
                theme="purple"
              />
              <Text variant="caption" tone="muted">
                Heart
              </Text>
            </View>

            <View className="items-center gap-1 min-w-[48px]">
              <CategoryIconBadge
                icon={<RefreshCw size={20} color="#0A84FF" />}
                theme="blue"
              />
              <Text variant="caption" tone="muted">
                Refresh
              </Text>
            </View>
          </View>
        </View>

        {/* 08. Status & Toast Alerts */}
        <View className="gap-2.5">
          <Text
            variant="caption"
            tone="primary"
            className="font-jakarta-bold uppercase tracking-wider text-[11px]"
          >
            08. Status & Toast Alerts
          </Text>

          <View className="gap-2">
            <ToastAlert
              type="success"
              message="Transaction added successfully"
            />
            <ToastAlert
              type="warning"
              message="Budget limit exceeded!"
            />
            <ToastAlert
              type="info"
              message="Card linked safely"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
