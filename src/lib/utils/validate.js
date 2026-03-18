/**
 * Validation helpers for forms
 */

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  // Min 8 chars
  return typeof password === "string" && password.length >= 8;
}

export function validateReferralCode(code) {
  // 6-10 uppercase alphanumeric characters
  return /^[A-Z0-9]{6,10}$/.test(code);
}

export function validateAmount(amount) {
  return typeof amount === "number" && amount > 0;
}
