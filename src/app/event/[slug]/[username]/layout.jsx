import { API_BASE_URL } from "@/lib/api/baseUrl";
import { getLandingPageUrl } from "@/lib/utils/referral";

// Revalidate every 60 seconds so metadata stays fresh without blocking requests
export const revalidate = 60;

/**
 * getEvent - Fetches all events and finds the one matching the slug/id
 */
async function getEvent(slug) {
  if (!slug) return null;
  
  try {
    const res = await fetch(`${API_BASE_URL}/event`, {
      next: { revalidate: 60 },
      headers: {
        "Accept": "application/json"
      }
    });

    if (!res.ok) return null;
    
    const events = await res.json();
    if (!Array.isArray(events)) return null;

    // Normalize slug for comparison (the slug in URL might be a cleaned event_id)
    const cleanSlug = slug.toLowerCase();

    return events.find(e => {
      const eventSlug = (e.event_slug || "").toLowerCase();
      const eventId = (e.event_id || "").toLowerCase();
      const cleanedId = eventId.replace("event:", "");
      
      return eventSlug === cleanSlug || cleanedId === cleanSlug || eventId === cleanSlug;
    });
  } catch (error) {
    console.error("[getEvent] Error:", error.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const username = resolvedParams?.username;

  const fallbackMetadata = {
    title: "Join this Event | Axile",
    description: "I saw this and thought of you! Check out this event on Axile and get your tickets.",
  };

  if (!slug) return fallbackMetadata;

  const event = await getEvent(slug);

  if (!event) return fallbackMetadata;

  // Map API fields to metadata requirements
  const title = event.event_name || event.title || "Axile Event";
  
  // Create a better description if one isn't provided
  let description = event.event_description || event.description;
  if (!description) {
    const date = event.event_date ? new Date(event.event_date).toLocaleDateString() : "";
    const location = event.event_location || event.location || "";
    description = `I saw this and thought of you! Join us for ${title}${location ? ` at ${location}` : ""}${date ? ` on ${date}` : ""}. Get your tickets via Axile.`;
  } else {
    // Prefix the personal message even if there is a description
    description = `I saw this and thought of you! ${description}`;
  }

  const imageUrl = event.event_image || event.image;
  
  const landingUrl = getLandingPageUrl();
  const eventUrl = `${landingUrl}/events/${slug}${username ? `?ref=${username}` : ""}`;

  return {
    title: title,
    description: description,
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
