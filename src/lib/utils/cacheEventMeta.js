/**
 * Client-side utility to push event metadata into the server cache.
 *
 * Call this whenever authenticated event data is available (e.g. when
 * event cards render, or when a referral link is copied).  The data
 * is sent to /api/event-meta/[slug] which stores it for later use
 * by generateMetadata when a social-media crawler requests OG tags.
 */

export async function cacheEventMeta(event) {
  if (!event?.event_slug) return;
  try {
    await fetch(`/api/event-meta/${encodeURIComponent(event.event_slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: event.name || event.event_name || event.title,
        image: event.image || event.event_image || event.banner,
        description: event.description || event.event_description,
        date: event.date,
        location: event.location,
        event_id: event.event_id || event.id,
      }),
    });
  } catch {
    // Silent fail — caching is best-effort and must never block the UI
  }
}

export async function bulkCacheEventMeta(events) {
  if (!Array.isArray(events)) return;
  await Promise.allSettled(events.map((e) => cacheEventMeta(e)));
}
