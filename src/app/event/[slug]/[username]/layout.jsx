import { getLandingPageUrl } from "@/lib/utils/referral";

// Revalidate every 60 seconds so metadata stays fresh without blocking requests
export const revalidate = 60;

export async function generateMetadata({ params }) {
  // Next.js 15 requires awaiting the params promise
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const username = resolvedParams?.username;

  const fallbackMetadata = {
    title: "Event Not Found | Axile",
    description: "The event you are looking for does not exist or has been removed.",
  };

  if (!slug) return fallbackMetadata;

  // --- FIX: Fetch the specific event directly by its slug/ID ---
  // Old code hit `/event/` (wrong endpoint, missing 's') and fetched ALL events.
  // New code hits `/events/{slug}/` directly, which is faster and reliable.
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const targetUrl = `${API_BASE}/events/${slug}/`;

  let event = null;
  try {
    console.log("[OG Metadata] Fetching event from:", targetUrl);
    const res = await fetch(targetUrl, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });

    console.log("[OG Metadata] Response status:", res.status);

    if (res.ok) {
      const data = await res.json();
      // API may return event at root level or nested under a key
      event = data?.event || data?.data || (data?.event_id ? data : null);
      if (event) {
        console.log("[OG Metadata] Found event:", event.event_name || event.title || event.name);
      } else {
        console.warn("[OG Metadata] Response OK but could not parse event object:", data);
      }
    } else {
      console.warn("[OG Metadata] Event fetch failed with status:", res.status);
    }
  } catch (error) {
    console.error("[OG Metadata] Network error fetching event:", error.message);
  }

  // Graceful fallback if event not found
  if (!event) return fallbackMetadata;

  const landingUrl = getLandingPageUrl();
  // Support all known field name variants from the Axile API
  const title = event.event_name || event.title || event.name || "Axile Event";
  const description =
    event.description ||
    event.event_description ||
    `Join ${title} — get your tickets via Axile.`;
  const eventUrl = `${landingUrl}/events/${slug}?ref=${username}`;
  // Support all known image field name variants
  const imageUrl = event.event_image || event.image || event.banner || event.cover_image;

  return {
    title: `${title} | Axile`,
    description,
    openGraph: {
      title,
      description,
      url: eventUrl,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
      type: "website",
      siteName: "Axile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default function EventReferralLayout({ children }) {
  return <>{children}</>;
}
