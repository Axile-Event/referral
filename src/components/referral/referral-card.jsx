/**
 * Referral Card Component
 *
 * Displays:
 * - Event name, referral code
 * - Commission amount
 * - Status (active | inactive)
 * - Conversions count
 * - Date created
 *
 * Brand: Status badge uses primary #e11d48, border #e4e4e7
 */

const STATUS_STYLES = {
  active: "bg-green-500/10 text-green-600 border border-green-500/20",
  inactive: "bg-muted text-muted-foreground border border-border",
};

export function ReferralCard({ referralId, code, eventName, commission, conversions, status, createdAt }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{eventName}</p>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{code}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>
      <div className="flex gap-6 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Commission</p>
          <p className="font-semibold text-primary">₦ {commission?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Conversions</p>
          <p className="font-semibold">{conversions ?? 0}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Created</p>
          <p className="font-semibold">{new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
