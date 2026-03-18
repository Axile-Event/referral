/**
 * Wallet Card Component
 *
 * Displays:
 * - Available balance
 * - Pending earnings
 * - Total earned
 * - Withdrawal button
 *
 * Colors: gradient from primary #e11d48 to rose-600
 */
export function WalletCard({ balance = 0, pending = 0, total = 0, onWithdraw }) {
  return (
    <div className="bg-gradient-to-r from-primary to-rose-600 rounded-xl p-6 text-white">
      <p className="text-sm opacity-80">Available Balance</p>
      <p className="text-4xl font-extrabold mt-1">
        ₦ {balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
      </p>
      <div className="flex gap-6 mt-4 text-sm opacity-80">
        <span>Pending: ₦ {pending.toLocaleString()}</span>
        <span>Total Earned: ₦ {total.toLocaleString()}</span>
      </div>
      <button
        onClick={onWithdraw}
        className="mt-4 px-5 py-2 bg-white text-primary rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
      >
        Withdraw
      </button>
    </div>
  );
}
