import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type PushPermissionState = "granted" | "denied" | "undetermined";

export interface PushStatusResult {
  status: PushPermissionState;
  canAskAgain: boolean;
}

let handlerConfigured = false;

export function ensureNotificationHandler(): void {
  if (handlerConfigured || Platform.OS === "web") return;
  handlerConfigured = true;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch {
    // Safe fallback if running on an unsupported environment
  }
}

export async function getNotificationPermissionStatus(): Promise<PushStatusResult> {
  if (Platform.OS === "web") {
    return { status: "denied", canAskAgain: false };
  }
  try {
    const res = await Notifications.getPermissionsAsync();
    const status: PushPermissionState = res.granted
      ? "granted"
      : res.status === "denied"
        ? "denied"
        : "undetermined";
    return {
      status,
      canAskAgain: res.canAskAgain ?? true,
    };
  } catch {
    return { status: "undetermined", canAskAgain: true };
  }
}

export async function requestNotificationPermission(): Promise<PushStatusResult> {
  if (Platform.OS === "web") {
    return { status: "denied", canAskAgain: false };
  }
  ensureNotificationHandler();
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("wealthflow-alerts", {
        name: "Spending & Budget Alerts",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200, 120, 200],
        lightColor: "#007AFF",
      });
    }

    const res = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    const status: PushPermissionState = res.granted
      ? "granted"
      : res.status === "denied"
        ? "denied"
        : "undetermined";

    return {
      status,
      canAskAgain: res.canAskAgain ?? true,
    };
  } catch {
    return { status: "denied", canAskAgain: false };
  }
}
