import Link from "next/link";

/**
 * Event Card Component
 *
 * Displays:
 * - Event image (optional)
 * - Event name, date
 * - Referral reward amount
 * - View/Share CTA buttons
 *
 * Props: eventId, name, date, reward, image
 */
export function EventCard({ eventId, name, date, reward, image }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      {image ? (
        <img src={image} alt={name} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-secondary flex items-center justify-center text-muted-foreground text-sm">
          No Image
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold leading-tight">{name}</h3>
        <p className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</p>
        <p className="text-sm font-semibold text-primary">
          Earn ₦ {reward?.toLocaleString() ?? "—"} per referral
        </p>
        <Link
          href={`/event/${eventId}`}
          className="mt-auto inline-block text-center h-9 leading-9 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Get Referral Link
        </Link>
      </div>
    </div>
  );
}
