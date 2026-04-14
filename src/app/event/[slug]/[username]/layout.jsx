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

  // 1. Fetch Event Data Server-Side for SEO indexing
  let event = null;
  try {
    const res = await fetch(`${API_BASE_URL}/events/${slug}/`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      event = await res.json();
    }
  } catch (error) {
    console.error("Error fetching event metadata:", error);
  }

  if (!event) {
    return {
      title: "Event Not Found | Axile",
      description: "The event you are looking for does not exist or has been removed."
    };
  }

  const landingUrl = getLandingPageUrl();
  const title = event.title || event.name || "Axile Event";
  const description = event.description || `Get tickets for ${title} on Axile.`;
  const eventUrl = `${landingUrl}/events/${slug}?ref=${username}`;

  // 2. Map properties to Next.js metadata format
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: eventUrl,
      images: event.image ? [event.image] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: event.image ? [event.image] : [],
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
