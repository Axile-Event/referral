/**
 * Wallet / Earnings Page
 *
 * Features:
 * - Available balance display
 * - Pending earnings
 * - Total earned
 * - Transaction history list
 * - Withdrawal button
 *
 * State: useWalletStore
 * Components: WalletCard, TransactionList
 */
export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-primary to-rose-600 rounded-xl p-6 text-white mb-6">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-4xl font-extrabold mt-1">₦ 0.00</p>
          <div className="flex gap-6 mt-4 text-sm opacity-80">
            <span>Pending: ₦ 0.00</span>
            <span>Total Earned: ₦ 0.00</span>
          </div>
          <button className="mt-4 px-5 py-2 bg-white text-primary rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
            Withdraw
          </button>
        </div>

        {/* TODO: Connect WalletCard and TransactionList using useWalletStore */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Transactions</h2>
          <p className="text-muted-foreground text-sm">No transactions yet.</p>
        </div>
      </div>
    </div>
  );
}
