import AsyncStorage from "@react-native-async-storage/async-storage";

const MOCK_AUTH_KEY = "mock_auth_signed_in";

let memorySignedIn: boolean = false;
type AuthListener = (signedIn: boolean) => void;
const listeners = new Set<AuthListener>();

function notify(signedIn: boolean) {
  listeners.forEach((listener) => {
    try {
      listener(signedIn);
    } catch (e) {
      console.warn("[AuthMock] Listener error:", e);
    }
  });
}

/**
 * Synchronous check for anchor redirect routes.
 */
export function getMockSignedInSync(): boolean {
  return memorySignedIn;
}

/**
 * Async initialization & storage read.
 */
export async function getMockSignedIn(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(MOCK_AUTH_KEY);
    memorySignedIn = val === "true";
    return memorySignedIn;
  } catch {
    memorySignedIn = false;
    return false;
  }
}

export async function setMockSignedIn(signedIn: boolean): Promise<void> {
  memorySignedIn = signedIn;
  notify(signedIn);
  try {
    if (signedIn) {
      await AsyncStorage.setItem(MOCK_AUTH_KEY, "true");
    } else {
      await AsyncStorage.removeItem(MOCK_AUTH_KEY);
    }
  } catch {
    // ignore
  }
}

export function subscribeMockAuth(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
