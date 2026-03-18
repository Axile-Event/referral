import { useWalletStore } from "@/store/walletStore";

/**
 * useWallet hook
 * Convenience wrapper around useWalletStore.
 */
export function useWallet() {
  const {
    balance,
    pending,
    totalEarned,
    transactions,
    isLoading,
    fetchWalletData,
    requestWithdrawal,
    fetchTransactionHistory,
  } = useWalletStore();

  return {
    balance,
    pending,
    totalEarned,
    transactions,
    isLoading,
    fetchWalletData,
    requestWithdrawal,
    fetchTransactionHistory,
  };
}
