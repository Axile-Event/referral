import { getEventMeta } from "@/lib/eventMetaStore";

// Revalidate every 60 seconds so metadata stays fresh without blocking requests
export const revalidate = 60;

export async function generateMetadata({ params }) {
  // Next.js 15 requires awaiting the params promise
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const username = resolvedParams?.username;

  // ---- Build canonical URL ----
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://referral.axile.ng";
  const pageUrl = username
    ? `${SITE_URL}/event/${slug}/${username}`
    : `${SITE_URL}/event/${slug}`;

  // ---- Generic Axile fallback (NEVER say "Event Not Found" to crawlers) ----
  const fallbackMetadata = {
    title: "Join this Event on Axile",
    description:
      "Get your tickets and join the event through Axile — the smart event platform.",
    openGraph: {
      title: "Join this Event on Axile",
      description:
        "Get your tickets and join the event through Axile — the smart event platform.",
      url: pageUrl,
      type: "website",
      siteName: "Axile",
    },
    twitter: {
      card: "summary_large_image",
      title: "Join this Event on Axile",
      description:
        "Get your tickets and join the event through Axile — the smart event platform.",
    },
  };

  if (!slug) return fallbackMetadata;

  // ==================================================================
  // Step 1 — Check the in-memory / temp-file cache (populated by the
  //          client-side app when a logged-in user views their events).
  //          This is the primary path that actually works for crawlers.
  // ==================================================================
  let event = getEventMeta(slug);

  // ==================================================================
  // Step 2 — Cache miss → try the backend API as a hail-mary.
  //          (Usually returns 401 for crawlers, but we try anyway.)
  // ==================================================================
  if (!event) {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (API_BASE) {
      const endpoints = [
        `${API_BASE}/referee/events/${slug}/`,
        `${API_BASE}/events/${slug}/`,
      ];

      for (const url of endpoints) {
        try {
          console.log("[OG Meta] Trying backend:", url);
          const res = await fetch(url, {
            next: { revalidate: 300 },
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          if (res.ok) {
            const data = await res.json();
            // Handle various API response shapes
            const parsed =
              data?.event ||
              data?.data ||
              (data?.name ? data : null) ||
              (data?.event_name ? data : null);

            if (parsed) {
              event = {
                name: parsed.name || parsed.event_name || parsed.title,
                image:
                  parsed.image ||
                  parsed.event_image ||
                  parsed.banner ||
                  parsed.cover_image,
                description: parsed.description || parsed.event_description,
              };
              console.log("[OG Meta] Found event from backend:", event.name);
              break;
            }
          }
        } catch (e) {
          console.warn("[OG Meta] Backend failed:", url, e.message);
        }
      }
    }
  }

  // ==================================================================
  // Step 3 — Still nothing → use the generic Axile branding.
  //          This is 1000× better than the old "Event Not Found".
  // ==================================================================
  if (!event) {
    console.log(
      "[OG Meta] No event data for slug:",
      slug,
      "— serving Axile branding"
    );
    return fallbackMetadata;
  }

  // ==================================================================
  // Build rich metadata from the cached/fetched event data
  // ==================================================================
  const title = event.name || "Axile Event";
  const description =
    event.description || `Join ${title} — get your tickets via Axile.`;

  // Ensure the image URL is absolute
  let imageUrl = event.image;
  if (imageUrl && !imageUrl.startsWith("http")) {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    imageUrl = `${API_BASE}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
        : [],
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
