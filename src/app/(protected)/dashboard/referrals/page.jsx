/**
 * Referrals List & Manage Page
 *
 * Features:
 * - List of user's referral links
 * - Status (Active / Inactive)
 * - Earnings per link
 * - Copy link, disable link actions
 *
 * State: useReferralStore
 * Components: ReferralCard
 */
export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Referrals</h1>

        {/* TODO: Referral cards list from useReferralStore */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground text-sm">
            You have no referral links yet. Browse events to generate one.
          </p>
        </div>
      </div>
    </div>
  );
}
