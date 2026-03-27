/**
 * Referral utility constants and helpers.
 * Central place for referral-related config.
 */

export const REFERRAL_STORAGE_KEY = "axile_referral_entry";
export const REFERRAL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const AXILE_MAIN_APP_URL = "https://axile.ng";

/**
 * Build the redirect URL for the main app with referral attached.
 * @param {string} eventId
 * @param {string} code
 * @returns {string}
 */
export function buildRedirectUrl(eventId, code) {
  return `${AXILE_MAIN_APP_URL}/event/${encodeURIComponent(eventId)}?ref=${encodeURIComponent(code)}`;
}

/**
 * Check if a referral timestamp has expired (> 7 days).
 * @param {number|null} timestamp
 * @returns {boolean}
 */
export function isReferralExpired(timestamp) {
  if (!timestamp) return true;
  return Date.now() - timestamp > REFERRAL_EXPIRY_MS;
}

/**
 * Validate referral code format.
 * Accepts alphanumeric + hyphens, 3-64 chars (flexible for various code formats).
 * @param {string} code
 * @returns {boolean}
 */
export function isValidReferralCode(code) {
  if (!code || typeof code !== "string") return false;
  return /^[A-Za-z0-9_-]{3,64}$/.test(code.trim());
}

/**
 * Validate event ID format.
 * Accepts common ID patterns: alphanumeric, colons, hyphens.
 * @param {string} id
 * @returns {boolean}
 */
export function isValidEventId(id) {
  if (!id || typeof id !== "string") return false;
  return /^[A-Za-z0-9:_-]{2,64}$/.test(id.trim());
}
