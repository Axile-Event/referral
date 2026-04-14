import { API_BASE_URL } from "@/lib/api/baseUrl";
import { getLandingPageUrl } from "@/lib/utils/referral";

// Optional: you can revalidate this layout periodically for fresh SEO data.
export const revalidate = 60; // seconds

export async function generateMetadata({ params }) {
  // params promise has been resolved by Next.js in layout when exported as generateMetadata
  const slug = params?.slug;
  const username = params?.username;

  if (!slug) {
    return {
      title: "Event Not Found | Axile",
      description: "The event you are looking for does not exist or has been removed.",
    };
  }

  let event = null;
  const targetUrl = `${API_BASE_URL}/event/`; // Fetch array of public events
  try {
    console.log("Fetching event metadata from:", targetUrl);
    const res = await fetch(targetUrl, {
      next: { revalidate: 60 }
    });
    console.log("Metadata Fetch Status:", res.status);
    if (res.ok) {
      const data = await res.json();
      const allEvents = Array.isArray(data) ? data : (data.events || data.data || []);
      
      // Match the event inside the returned array
      // The slug from the URL typically looks like 'EV-27795' or 'event:EV-27795'
      event = allEvents.find(e => 
        e.event_id === slug || 
        e.event_id === `event:${slug}` || 
        (e.event_slug && e.event_slug === slug)
      );
      
      if (event) {
        console.log("Fetched event title:", event.event_name || event.title);
      } else {
        console.warn(`Event ${slug} not found in the public events array.`, allEvents);
      }
    } else {
      console.error("Failed to fetch event metadata. Response text:", await res.text());
    }
  } catch (error) {
    console.error("Error fetching event metadata:", error.message);
  }

  if (!event) {
    return {
      title: "Event Not Found | Axile",
      description: "The event you are looking for does not exist or has been removed."
    };
  }

  const landingUrl = getLandingPageUrl();
  // Using exact keys from Axile API testing: event_name, event_image, event_price
  const title = event.event_name || event.title || event.name || "Axile Event";
  const description = event.description || `Get tickets for ${title} on Axile.`;
  const eventUrl = `${landingUrl}/events/${slug}?ref=${username}`;
  const imageUrl = event.event_image || event.image;

  // 2. Map properties to Next.js metadata format
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: eventUrl,
      images: imageUrl ? [imageUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default function EventReferralLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
