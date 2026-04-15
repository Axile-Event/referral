/**
 * Server-side event metadata cache.
 *
 * WHY: The backend API requires authentication to fetch event data,
 * but social-media crawlers (WhatsApp, Twitter, Facebook) hit referral
 * URLs without auth. This cache bridges the gap:
 *   1. The client populates it when a logged-in user views events.
 *   2. generateMetadata reads from it when a crawler requests OG tags.
 *
 * Strategy:
 *   - In-memory Map via globalThis (fastest, survives across requests
 *     within the same Node/Lambda process).
 *   - Temp-file backup via os.tmpdir() so the cache survives Lambda
 *     cold-starts within the same deployment.
 *
 * This module is SERVER-ONLY — never import it in client components.
 */

import fs from "fs";
import path from "path";
import os from "os";

// ---- constants ----
const CACHE_SYMBOL = Symbol.for("__axile_event_meta_cache__");
const CACHE_TTL = 48 * 60 * 60 * 1000; // 48 hours
const TEMP_FILE = path.join(os.tmpdir(), "axile-event-meta-cache.json");

// ---- initialise global map (once per process) ----
if (!globalThis[CACHE_SYMBOL]) {
  globalThis[CACHE_SYMBOL] = new Map();

  // Attempt to hydrate from the temp-file on cold start
  try {
    if (fs.existsSync(TEMP_FILE)) {
      const raw = JSON.parse(fs.readFileSync(TEMP_FILE, "utf8"));
      const now = Date.now();
      Object.entries(raw).forEach(([key, value]) => {
        if (value?._cachedAt && now - value._cachedAt < CACHE_TTL) {
          globalThis[CACHE_SYMBOL].set(key, value);
        }
      });
      console.log(
        `[EventMetaStore] Hydrated ${globalThis[CACHE_SYMBOL].size} entries from disk`
      );
    }
  } catch {
    // temp file missing or corrupt — that's fine
  }
}

/** @type {Map<string, object>} */
const cache = globalThis[CACHE_SYMBOL];

// ---- helpers ----

function persistToDisk() {
  try {
    fs.writeFileSync(
      TEMP_FILE,
      JSON.stringify(Object.fromEntries(cache)),
      "utf8"
    );
  } catch {
    // /tmp may not be writable in every environment — silent fail
  }
}

function normalise(meta) {
  return {
    name:
      meta.name || meta.event_name || meta.title || null,
    image:
      meta.image || meta.event_image || meta.banner || meta.cover_image || null,
    description:
      meta.description || meta.event_description || null,
    date: meta.date || null,
    location: meta.location || null,
    event_id: meta.event_id || meta.id || null,
  };
}

// ---- public API ----

/**
 * Retrieve cached metadata for an event slug.
 * Returns null when the slug is unknown or the entry has expired.
 */
export function getEventMeta(slug) {
  if (!slug) return null;
  const entry = cache.get(slug);
  if (!entry) return null;
  if (Date.now() - (entry._cachedAt || 0) > CACHE_TTL) {
    cache.delete(slug);
    return null;
  }
  return entry;
}

/**
 * Store metadata for one event slug.
 */
export function setEventMeta(slug, meta) {
  if (!slug || !meta) return;
  cache.set(slug, { ...normalise(meta), event_slug: slug, _cachedAt: Date.now() });
  persistToDisk();
}

/**
 * Bulk-store metadata for an array of event objects.
 */
export function bulkSetEventMeta(events) {
  if (!Array.isArray(events)) return;
  events.forEach((event) => {
    const slug = event.event_slug;
    if (slug) {
      cache.set(slug, {
        ...normalise(event),
        event_slug: slug,
        _cachedAt: Date.now(),
      });
    }
  });
  persistToDisk();
}
