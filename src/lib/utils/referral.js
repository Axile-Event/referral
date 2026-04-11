/**
 * Referral utility constants and helpers.
 * Central place for referral-related config.
 */

export const REFERRAL_STORAGE_KEY = "axile_referral_entry";
export const REFERRAL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate a shareable referral link for a referee and event.
 * Backend provides: { event_slug, username }
 * 
 * Rules:
 * 1. Always use event_slug (identifier)
 * 2. Always use username
 * 
 * New Format: referral.axile.ng/event/{event-slug}/{username}
 */
export function generateReferralLink(data) {
  if (!data) return "";
  const { event_slug, username, event_id } = data;
  
  // Clean identifier: use event_slug
  const identifier = event_slug || (event_id ? event_id.replace("event:", "") : "");
  
  if (!username || !identifier) return "";
  
  // Use standardized Referral URL
  const baseUrl = process.env.NEXT_PUBLIC_REFERRAL_URL?.replace(/\/$/, "") || "https://referral.axile.ng";
  return `${baseUrl}/event/${identifier}/${username}`;
}

/**
 * Get the target URL for the main Axile application. 
 * Falls back to axiledev.vercel.app for development testing.
 */
export function getMainAppUrl() {
  return process.env.NEXT_PUBLIC_MAIN_APP_URL?.replace(/\/$/, "") || "https://app.axile.ng";
}

/**
 * Get the target URL for the Axile landing page.
 */
export function getLandingPageUrl() {
  return process.env.NEXT_PUBLIC_LANDING_URL?.replace(/\/$/, "") || "https://axile.ng";
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
  return `${mainAppUrl}/events/${encodeURIComponent(cleanId)}?ref=${safeCode}`;
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
  return /^[A-Za-z0-9_:-]{3,64}$/.test(code.trim());
}

/**
 * Validate event ID format.
 */
export function isValidEventId(id) {
  if (!id || typeof id !== "string") return false;
  return /^[A-Za-z0-9:_-]{2,64}$/.test(id.trim());
}

/**
 * Formats the reward label from event data.
 * Goal: Every number comes directly from API with no transformation except formatting.
 */
export function formatRewardLabel(event) {
  if (!event) return "";
  if (event.referral_reward_type === "flat") {
    return `₦${(event.referral_reward_amount || 0).toLocaleString()} per ticket`;
  }
  if (event.referral_reward_type === "percentage") {
    return `${event.referral_reward_percentage || 0}% per ticket`;
  }
  return "";
}
