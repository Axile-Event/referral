/**
 * Single Event Details Page — /event/[id]
 *
 * Features:
 * - Event info (name, description, date, location)
 * - Referral details (commission, how to earn)
 * - Referral link generator
 * - QR code generator (qrcode.react)
 * - Share buttons (copy link, social)
 *
 * Data: eventApi.getEventById(id), eventApi.getEventReferralInfo(id)
 */
export default function EventDetail({ params }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Event Details</h1>
        <p className="text-muted-foreground text-sm mb-6">ID: {id}</p>

        {/* Event Info Card */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <p className="text-muted-foreground text-sm">TODO: Load event info via eventApi.getEventById(id)</p>
        </div>

        {/* Referral Link Generator */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">Your Referral Link</h2>
          <p className="text-muted-foreground text-sm">TODO: ReferralLink + QRCode components</p>
          <button className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            Generate Link
          </button>
        </div>
      </div>
    </div>
  );
}
