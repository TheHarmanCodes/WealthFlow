import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DynamicScreenHeader } from "./dynamic-screen-header";

interface TabScreenWrapperProps {
  title: string;
  children?: React.ReactNode;
}

export function TabScreenWrapper({ title, children }: TabScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  return (
    <View
      style={[
        styles.screenRoot,
        {
          backgroundColor: isDark ? "#080C16" : "#F8FAFC",
          paddingTop: Math.max(insets.top, 16),
        },
      ]}
    >
      {/* Shared Reusable Dynamic Top Header */}
      <DynamicScreenHeader title={title} />

      {/* Screen Content ScrollView with ample bottom clearance for floating tab bar */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          // 120 padding bottom ensures content can scroll underneath the floating glass tab bar
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
