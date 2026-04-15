/**
 * /api/event-meta/[slug]
 *
 * Lightweight API route that lets the authenticated client-side app
 * push event metadata into the server-side cache, so that
 * generateMetadata can serve rich OG tags to social-media crawlers
 * even though the backend API requires auth.
 *
 *   POST — store event metadata (called from the client when events load)
 *   GET  — retrieve cached metadata (mainly for debugging)
 */

import { getEventMeta, setEventMeta } from "@/lib/eventMetaStore";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const meta = getEventMeta(slug);
  if (meta) {
    return NextResponse.json(meta);
  }
  return NextResponse.json({ error: "Not cached" }, { status: 404 });
}

export async function POST(request, { params }) {
  const { slug } = await params;
  try {
    const body = await request.json();
    setEventMeta(slug, body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
