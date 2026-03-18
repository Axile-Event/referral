/**
 * Event Detail Component
 * Full event info + referral reward breakdown.
 * Props: event (Event object), referralInfo (EventReferralInfo)
 */
export function EventDetail({ event, referralInfo }) {
  if (!event) return null;

  return (
    <div className="flex flex-col gap-4">
      {event.image && (
        <img src={event.image} alt={event.name} className="w-full rounded-xl h-52 object-cover" />
      )}
      <div>
        <h2 className="text-2xl font-bold">{event.name}</h2>
        <p className="text-muted-foreground text-sm mt-1">{event.description}</p>
      </div>
      <div className="flex gap-4 flex-wrap text-sm">
        <span className="text-muted-foreground">📅 {new Date(event.date).toLocaleDateString()}</span>
        <span className="text-muted-foreground">📍 {event.location}</span>
        {event.price != null && <span className="text-muted-foreground">🎟 ₦ {event.price.toLocaleString()}</span>}
      </div>
      {referralInfo && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-primary">
            Referral Reward: ₦ {referralInfo.reward?.toLocaleString()} per conversion
          </p>
          <p className="text-xs text-muted-foreground mt-1">{referralInfo.description}</p>
        </div>
      )}
    </div>
  );
}
