/**
 * Transaction List Component
 *
 * Displays a list of wallet transactions.
 * Props: transactions (array of Transaction objects)
 */

const TYPE_LABELS = {
  referral: "Referral Commission",
  withdrawal: "Withdrawal",
  refund: "Refund",
  bonus: "Bonus",
};

const STATUS_STYLES = {
  completed: "text-green-600",
  pending: "text-yellow-600",
  failed: "text-red-600",
};

export function TransactionList({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl divide-y divide-border">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-medium">{TYPE_LABELS[tx.type] ?? tx.type}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{tx.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">₦ {tx.amount.toLocaleString()}</p>
            <p className={`text-xs capitalize ${STATUS_STYLES[tx.status]}`}>{tx.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
