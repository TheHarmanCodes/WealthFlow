import * as LocalAuthentication from "expo-local-authentication";

export interface BiometricCapabilities {
  hasHardware: boolean;
  isEnrolled: boolean;
  label: string;
  isFaceId: boolean;
}

export async function getBiometricCapabilities(): Promise<BiometricCapabilities> {
  const isIOS = process.env.EXPO_OS === "ios";
  try {
    const [hasHardware, isEnrolled, types] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync(),
    ]);

    const hasFace = types.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    );
    const hasFingerprint = types.includes(
      LocalAuthentication.AuthenticationType.FINGERPRINT,
    );

    let label = "Biometrics";
    if (isIOS) {
      label = hasFace ? "Face ID" : hasFingerprint ? "Touch ID" : "Biometrics";
    } else if (hasFace && hasFingerprint) {
      label = "Biometric & Face Unlock";
    } else if (hasFace) {
      label = "Face Unlock";
    } else if (hasFingerprint) {
      label = "Fingerprint";
    }

    return {
      hasHardware,
      isEnrolled,
      label,
      isFaceId: hasFace,
    };
  } catch {
    return {
      hasHardware: false,
      isEnrolled: false,
      label: isIOS ? "Face ID" : "Biometrics",
      isFaceId: isIOS,
    };
  }
}

export interface BiometricPromptOptions {
  promptMessage?: string;
  promptSubtitle?: string;
}

export async function promptBiometricAuth(
  options: string | BiometricPromptOptions = "Unlock WealthFlow",
): Promise<LocalAuthentication.LocalAuthenticationResult> {
  const resolved =
    typeof options === "string"
      ? {
          promptMessage: options,
          promptSubtitle: "Verify your identity to continue",
        }
      : {
          promptMessage: options.promptMessage ?? "Unlock WealthFlow",
          promptSubtitle:
            options.promptSubtitle ?? "Verify your identity to continue",
        };

  try {
    return await LocalAuthentication.authenticateAsync({
      promptMessage: resolved.promptMessage,
      promptSubtitle: resolved.promptSubtitle,
      cancelLabel: "Cancel",
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: false,
      biometricsSecurityLevel: "weak",
    });
  } catch {
    return { success: false, error: "unknown" };
  }
}
