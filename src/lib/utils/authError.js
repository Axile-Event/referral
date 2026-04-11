/**
 * Auth Error Handler
 * Centralized error message extraction and handling
 */

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error, defaultMessage = "An error occurred") => {
  // Check nested response structure – order matters
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  // Handle validation error objects (e.g., { email: ["Invalid format"] })
  if (error?.response?.data && typeof error.response.data === "object") {
    return formatValidationError(error.response.data);
  }

  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
};

/**
 * Create error object with user-friendly message
 */
export const createAuthError = (error, context = "") => {
  return {
    message: getErrorMessage(error),
    context,
    raw: error,
  };
};

/**
 * Validation error formatter
 */
export const formatValidationError = (errors) => {
  if (!errors) return "An unexpected error occurred";
  if (typeof errors === "string") return errors;
  if (typeof errors === "object") {
    const messages = Object.values(errors)
      .flat()
      .filter((msg) => typeof msg === "string");
    return messages.join(", ") || "Validation failed";
  }
  return "Invalid input";
};
