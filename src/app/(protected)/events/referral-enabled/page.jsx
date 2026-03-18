/**
 * Events with Referral Enabled Page
 *
 * Features:
 * - List of events that have referral rewards enabled
 * - Filter by category, date, earnings potential
 * - Event cards with referral reward info
 * - CTA: "Generate Referral Link"
 *
 * Data: TanStack Query → eventApi.getReferralEnabledEvents()
 * Components: EventCard, EventList
 */
export default function ReferralEnabledEvents() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Browse Events</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Pick an event to generate your referral link and start earning.
        </p>

        {/* TODO: EventList from eventApi.getReferralEnabledEvents() */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-muted-foreground text-sm">Loading events...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
