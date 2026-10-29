/**
 * Safely extracts a user-friendly error message from a Clerk error
 */
export function getClerkErrorMessage(
  err: unknown,
  fallback = "An error occurred",
): string {
  if (err && typeof err === "object") {
    const errorObj = err as {
      longMessage?: string;
      message?: string;
      errors?: { longMessage?: string; message?: string }[];
    };

    if (errorObj.longMessage) return errorObj.longMessage;
    if (errorObj.message) return errorObj.message;
    if (errorObj.errors?.[0]?.longMessage) return errorObj.errors[0].longMessage;
    if (errorObj.errors?.[0]?.message) return errorObj.errors[0].message;
  }

  return fallback;
}
