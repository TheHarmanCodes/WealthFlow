import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { Check, RotateCcw, X } from "lucide-react-native";
import {
  CURRENCIES,
  CurrencyItem,
  detectDeviceCurrency,
} from "@/constants/currencies";
import { AnimatedBottomSheet } from "./animated-bottom-sheet";
import { SearchMagnifyingGlassIcon } from "./profile-icons";

interface CurrencyPickerSheetProps {
  visible: boolean;
  selectedCode: string;
  isAutoDetected: boolean;
  onSelect: (code: string, isAuto?: boolean) => void;
  onClose: () => void;
}

export function CurrencyPickerSheet({
  visible,
  selectedCode,
  isAutoDetected,
  onSelect,
  onClose,
}: CurrencyPickerSheetProps) {
  const isDark = useColorScheme() === "dark";
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = Math.min(windowHeight * 0.84, 680);

  const [query, setQuery] = useState("");
  const detected = useMemo(() => detectDeviceCurrency(), []);

  const filteredCurrencies = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [...CURRENCIES].sort((a, b) => {
        if (a.code === selectedCode) return -1;
        if (b.code === selectedCode) return 1;
        if (a.code === detected.currency.code) return -1;
        if (b.code === detected.currency.code) return 1;
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.code.localeCompare(b.code);
      });
    }

    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(trimmed) ||
        c.name.toLowerCase().includes(trimmed) ||
        c.countries.toLowerCase().includes(trimmed) ||
        c.symbol.toLowerCase().includes(trimmed),
    );
  }, [query, selectedCode, detected.currency.code]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  return (
    <AnimatedBottomSheet
      visible={visible}
      onClose={handleClose}
      height={sheetHeight}
      withKeyboardAvoidance
    >
      {(requestClose) => {
        const handleChoose = (item: CurrencyItem, auto = false) => {
          Haptics.selectionAsync().catch(() => {});
          onSelect(item.code, auto);
          requestClose();
        };

        return (
          <View className="flex-1">
            {/* Subtle top blur header */}
            <View className="px-5 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <BlurView
                intensity={70}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
              <View className="absolute inset-0 bg-[#F2F2F7]/85 dark:bg-[#1C1C1E]/85" />

              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1 pr-3">
                  <Text className="text-[20px] font-jakarta-bold text-black dark:text-white tracking-[-0.3px]">
                    Primary Currency
                  </Text>
                  <Text className="text-[12px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D] mt-0.5">
                    {detected.regionCode
                      ? `Phone region (${detected.regionCode}): ${detected.currency.flag} ${detected.currency.code} (${detected.currency.symbol})`
                      : `Default currency: ${detected.currency.code} (${detected.currency.symbol})`}
                  </Text>
                </View>

                <Pressable
                  onPress={() => requestClose()}
                  accessibilityRole="button"
                  accessibilityLabel="Close currency picker"
                  className="w-8 h-8 rounded-full bg-black/[0.07] dark:bg-white/[0.12] items-center justify-center"
                >
                  <X size={16} color={isDark ? "#FFFFFF" : "#000000"} />
                </Pressable>
              </View>

              {/* Search bar with SearchMagnifyingGlassIcon */}
              <View className="flex-row items-center gap-2.5 px-3.5 h-11 rounded-[14px] bg-black/[0.06] dark:bg-white/[0.09]">
                <SearchMagnifyingGlassIcon
                  size={18}
                  color={isDark ? "#98989D" : "#6B7280"}
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search currency, code, or country"
                  placeholderTextColor={isDark ? "#8E8E93" : "#6B7280"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                  className="flex-1 text-[15px] font-jakarta-regular text-black dark:text-white py-0"
                />
                {query.length > 0 && (
                  <Pressable
                    onPress={() => setQuery("")}
                    hitSlop={8}
                    accessibilityLabel="Clear search"
                    className="w-5 h-5 rounded-full bg-black/15 dark:bg-white/20 items-center justify-center"
                  >
                    <X size={12} color={isDark ? "#000000" : "#FFFFFF"} />
                  </Pressable>
                )}
              </View>

              {!isAutoDetected && selectedCode !== detected.currency.code && (
                <Pressable
                  onPress={() => handleChoose(detected.currency, true)}
                  className="mt-2.5 self-start flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#007AFF]/12"
                >
                  <RotateCcw size={13} color="#007AFF" />
                  <Text className="text-[12px] font-jakarta-semibold text-[#007AFF]">
                    Use phone currency ({detected.currency.flag}{" "}
                    {detected.currency.code})
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Currency list */}
            <FlatList
              data={filteredCurrencies}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: 24,
              }}
              ListEmptyComponent={
                <View className="items-center justify-center py-14 px-6">
                  <Text className="text-[16px] font-jakarta-semibold text-black dark:text-white">
                    No currencies found
                  </Text>
                  <Text className="text-[13px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D] text-center mt-1">
                    Try searching by ISO code like USD, INR, EUR, or a country
                    name.
                  </Text>
                </View>
              }
              renderItem={({ item, index }) => {
                const isSelected = item.code === selectedCode;
                const isDetected = item.code === detected.currency.code;
                const isFirst = index === 0;
                const isLast = index === filteredCurrencies.length - 1;

                return (
                  <Pressable
                    onPress={() => handleChoose(item, false)}
                    className={`flex-row items-center px-4 py-3.5 bg-white dark:bg-[#2C2C2E] ${
                      isFirst ? "rounded-t-[16px]" : ""
                    } ${isLast ? "rounded-b-[16px]" : ""} ${
                      !isLast
                        ? "border-b border-black/[0.05] dark:border-white/[0.07]"
                        : ""
                    }`}
                  >
                    <Text className="text-[24px] mr-3">{item.flag}</Text>

                    <View className="flex-1 pr-2">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-[15px] font-jakarta-semibold text-black dark:text-white">
                          {item.name}
                        </Text>
                        {isDetected && (
                          <View className="px-2 py-0.5 rounded-full bg-[#007AFF]/12">
                            <Text className="text-[10px] font-jakarta-bold text-[#007AFF]">
                              LOCAL
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        numberOfLines={1}
                        className="text-[12px] font-jakarta-regular text-[#6B7280] dark:text-[#98989D] mt-0.5"
                      >
                        {item.code} · {item.countries}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2.5">
                      <View className="px-2.5 py-1 rounded-[8px] bg-black/[0.04] dark:bg-white/[0.08]">
                        <Text className="text-[13px] font-jakarta-semibold text-black dark:text-white">
                          {item.symbol}
                        </Text>
                      </View>

                      {isSelected ? (
                        <View className="w-6 h-6 rounded-full bg-[#007AFF] items-center justify-center">
                          <Check size={14} color="#FFFFFF" strokeWidth={2.8} />
                        </View>
                      ) : (
                        <View className="w-6 h-6" />
                      )}
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        );
      }}
    </AnimatedBottomSheet>
  );
}
