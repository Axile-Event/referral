/**
 * Earnings Chart Component
 * TODO: Implement with recharts or a simple bar chart showing monthly earnings.
 * Props: data (array of { month, amount })
 */
export function EarningsChart({ data = [] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-sm font-semibold mb-4">Earnings Over Time</h3>
      {/* TODO: Chart implementation */}
      <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
        Chart coming soon
      </div>
    </div>
  );
}
