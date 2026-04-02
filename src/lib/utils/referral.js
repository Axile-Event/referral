/**
 * Referral utility constants and helpers.
 * Central place for referral-related config.
 */

export const REFERRAL_STORAGE_KEY = "axile_referral_entry";
export const REFERRAL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate a shareable referral link for a referee and event.
 * Backend provides: { referee_id, event_slug, event_id }
 * 
 * Rules:
 * 1. event_identifier = event_slug OR event_id (with 'event:' prefix removed)
 * 2. Never use raw event: prefix in URL
 * 3. Always use referee_id
 */
export function generateReferralLink(data) {
  if (!data) return "";
  const { referee_id, event_slug, event_id } = data;
  
  // Clean identifier: fallback to ID if slug is missing
  const identifier = event_slug || (event_id ? event_id.replace("event:", "") : "");
  
  if (!referee_id || !identifier) return "";
  
  // Production referral domain is hardcoded as per instructions
  return `https://referral.axile.ng/ref/${referee_id}/event/${identifier}`;
}

/**
 * Get the target URL for the main Axile application. 
 * Falls back to axiledev.vercel.app for development testing.
 */
export function getMainAppUrl() {
  return process.env.NEXT_PUBLIC_MAIN_APP_URL?.replace(/\/$/, "") || "https://axiledev.vercel.app";
}

/**
 * Build the redirect URL for the main app with referral attached.
 * 
 * Target: https://axile.ng/event/{clean_id}?ref={referee_id}
 * (Domain remains dynamic via getMainAppUrl per user request)
 */
export function buildRedirectUrl(eventId, code) {
  const mainAppUrl = getMainAppUrl();
  const cleanId = eventId ? eventId.replace("event:", "") : "";
  // Decoding then encoding ensures we don't end up with double-encoded values like %253A
  const safeCode = code ? decodeURIComponent(decodeURIComponent(code)) : "";
  return `${mainAppUrl}/event/${encodeURIComponent(cleanId)}?ref=${encodeURIComponent(safeCode)}`;
}

/**
 * Check if a referral timestamp has expired (> 7 days).
 */
export function isReferralExpired(timestamp) {
  if (!timestamp) return true;
  return Date.now() - timestamp > REFERRAL_EXPIRY_MS;
}

/**
 * Validate referral code format.
 */
export function isValidReferralCode(code) {
  if (!code || typeof code !== "string") return false;
  return /^[A-Za-z0-9_-]{3,64}$/.test(code.trim());
}

/**
 * Validate event ID format.
 */
export function isValidEventId(id) {
  if (!id || typeof id !== "string") return false;
  return /^[A-Za-z0-9:_-]{2,64}$/.test(id.trim());
}
