/**
 * Unified Backend Error Parser
 * Extracts the most specific error message from an API response.
 * Handles: { message: "msg" }, { detail: "msg" }, { error: "msg" }, or { field: ["error"] }
 */
export function parseApiError(error) {
  if (!error) return "Something went wrong. Please try again.";
  
  const data = error.response?.data;
  if (!data) return error.message || "An unexpected network error occurred.";

  // 1. Check for standard message/error/detail keys
  const topLevelMessage = data.message || data.error || data.detail;
  if (typeof topLevelMessage === "string") return topLevelMessage;

  // 2. Check for validation maps: { Firstname: ["This field is required."] }
  if (typeof data === "object") {
    const errorEntries = Object.entries(data);
    if (errorEntries.length > 0) {
      const [field, messages] = errorEntries[0]; // Take the first error
      const msg = Array.isArray(messages) ? messages[0] : messages;
      
      // If it's a generic field-validation map, format it nicely
      if (typeof msg === "string") {
        return `${field}: ${msg}`;
      }
    }
  }

  return "An unexpected error occurred. Please check your information.";
}
