/**
 * Main Dashboard Page
 *
 * Features:
 * - User profile summary
 * - Total referrals count
 * - Earnings overview
 * - Quick actions (Create Referral Link, View Events)
 * - Recent referrals list
 *
 * State: useAuthStore, useReferralStore, useWalletStore
 * Components: StatCard, RecentReferralsList
 */
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Referrals", value: "—" },
            { label: "Total Earnings", value: "—" },
            { label: "Active Links", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8">
          <a
            href="/events/referral-enabled"
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Browse Events
          </a>
          <a
            href="/dashboard/referrals"
            className="px-5 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
          >
            My Referrals
          </a>
          <a
            href="/dashboard/wallet"
            className="px-5 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Wallet
          </a>
        </div>

        {/* TODO: Recent referrals list */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Referrals</h2>
          <p className="text-muted-foreground text-sm">No referrals yet. Browse events to get started.</p>
        </div>
      </div>
    </div>
  );
}
