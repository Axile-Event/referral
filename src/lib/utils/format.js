/**
 * Formatting utilities
 */

export function formatCurrency(amount, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatReferralLink(eventSlug, username) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://axilereferraldev.vercel.app";
  return `${base}/event/${eventSlug}/${username}`;
}

export function truncate(str, length = 40) {
  return str?.length > length ? str.slice(0, length) + "..." : str;
}
