/**
 * Referral Landing Page — /ref/[code]/event/[id]
 *
 * Features:
 * - Shown when someone clicks a referral link
 * - Displays event info with referral context
 * - "Sign Up & Attend" CTA
 * - Tracks referrer via URL code parameter
 *
 * Validates referral code → pre-fills referrer on signup.
 */
export default function ReferralEventPage({ params }) {
  const { code, id } = params;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
          You were invited
        </p>
        <h1 className="text-3xl font-extrabold mb-2">Join this Event</h1>
        <p className="text-muted-foreground mb-8">
          Referral Code: <span className="font-mono text-primary">{code}</span>
          {" — "}Event ID: {id}
        </p>

        {/* TODO: Fetch event info and display it */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 text-left">
          <p className="text-muted-foreground text-sm">
            TODO: Load event info and referral details
          </p>
        </div>

        <a
          href={`/signup?ref=${code}&event=${id}`}
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Sign Up & Attend
        </a>
      </div>
    </div>
  );
}
