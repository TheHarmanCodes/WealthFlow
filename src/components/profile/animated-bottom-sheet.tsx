import React, { useCallback, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AnimatedBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: number;
  withKeyboardAvoidance?: boolean;
  children: (requestClose: () => void) => React.ReactNode;
}

function SheetBody({
  onClose,
  height,
  withKeyboardAvoidance,
  children,
}: Omit<AnimatedBottomSheetProps, "visible">) {
  const insets = useSafeAreaInsets();
  const offscreenY = height ?? 520;
  const translateY = useSharedValue(offscreenY);
  const backdropOpacity = useSharedValue(0);
  const isClosing = useSharedValue(0);

  useEffect(() => {
    isClosing.set(0);
    translateY.set(offscreenY);
    backdropOpacity.set(0);
    translateY.set(
      withTiming(0, { duration: 290, easing: Easing.out(Easing.cubic) }),
    );
    backdropOpacity.set(
      withTiming(1, { duration: 210, easing: Easing.out(Easing.quad) }),
    );
  }, [offscreenY, translateY, backdropOpacity, isClosing]);

  const requestClose = useCallback(() => {
    if (isClosing.get() === 1) return;
    isClosing.set(1);

    backdropOpacity.set(
      withTiming(0, { duration: 170, easing: Easing.in(Easing.quad) }),
    );
    translateY.set(
      withTiming(
        offscreenY,
        { duration: 210, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(onClose)();
        },
      ),
    );
  }, [backdropOpacity, isClosing, offscreenY, onClose, translateY]);

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));

  const backdropAnimStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.get(),
  }));

  const content = (
    <>
      <Animated.View
        style={[StyleSheet.absoluteFill, backdropAnimStyle]}
        className="bg-black/45"
      >
        <Pressable className="flex-1" onPress={() => requestClose()} />
      </Animated.View>

      <Animated.View
        style={[
          height
            ? {
                height,
                paddingBottom: Math.max(insets.bottom, 16),
                borderCurve: "continuous",
              }
            : {
                paddingBottom: Math.max(insets.bottom, 20) + 8,
                borderCurve: "continuous",
              },
          sheetAnimStyle,
        ]}
        className="w-full rounded-t-[28px] overflow-hidden bg-[#F2F2F7] dark:bg-[#1C1C1E]"
      >
        <View className="self-center w-9 h-1 rounded-full bg-black/20 dark:bg-white/25 mt-2.5 mb-3" />
        {children(requestClose)}
      </Animated.View>
    </>
  );

  return (
    <Modal
      visible
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={() => requestClose()}
    >
      {withKeyboardAvoidance ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-end"
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        <View className="flex-1 justify-end">{content}</View>
      )}
    </Modal>
  );
}

export function AnimatedBottomSheet({
  visible,
  onClose,
  height,
  withKeyboardAvoidance = false,
  children,
}: AnimatedBottomSheetProps) {
  if (!visible) return null;

  return (
    <SheetBody
      onClose={onClose}
      height={height}
      withKeyboardAvoidance={withKeyboardAvoidance}
    >
      {children}
    </SheetBody>
  );
}
