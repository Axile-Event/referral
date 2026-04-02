/**
 * Referral utility constants and helpers.
 * Central place for referral-related config.
 */

export const REFERRAL_STORAGE_KEY = "axile_referral_entry";
export const REFERRAL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate a shareable referral link for a referee and event.
 * Format: /ref/{referee_id}/event/{event_identifier}
 * 
 * Rules:
 * 1. event_identifier = event_slug OR event_id (with 'event:' prefix removed)
 * 2. referee_id = The unique ID for the user from backend (username or referee_id)
 */
export function generateReferralLink(refereeId, eventSlug, eventId) {
  const baseUrl = process.env.NEXT_PUBLIC_AXILE_DEV_URL?.replace(/\/$/, "") || "https://axilereferraldev.vercel.app";
  const identifier = eventSlug || (eventId ? eventId.replace("event:", "") : "");
  
  if (!refereeId || !identifier) return "";
  
  return `${baseUrl}/ref/${encodeURIComponent(refereeId)}/event/${encodeURIComponent(identifier)}`;
}

/**
 * Get the target URL for the main Axile application. 
 * Falls back to axile.ng in production if not configured.
 */
export function getMainAppUrl() {
  return process.env.NEXT_PUBLIC_MAIN_APP_URL?.replace(/\/$/, "") || "https://axile.ng";
}

/**
 * Build the redirect URL for the main app with referral attached.
 * 
 * Target: https://axiledev.vercel.app/events/{clean_id}?ref={referee_id}
 */
export function buildRedirectUrl(eventId, code) {
  const mainAppUrl = getMainAppUrl();
  const cleanId = eventId ? eventId.replace("event:", "") : "";
  return `${mainAppUrl}/events/${encodeURIComponent(cleanId)}?ref=${encodeURIComponent(code)}`;
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
