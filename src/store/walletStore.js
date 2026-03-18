import { create } from "zustand";

/**
 * Wallet Store (Zustand)
 *
 * State: balance, pending, totalEarned, transactions[], isLoading
 * Actions: fetchWalletData, requestWithdrawal, fetchTransactionHistory
 *
 * TODO: Connect to walletApi
 */
export const useWalletStore = create((set) => ({
  balance: 0,
  pending: 0,
  totalEarned: 0,
  transactions: [],
  isLoading: false,

  fetchWalletData: async () => {
    set({ isLoading: true });
    try {
      // TODO: const data = await walletApi.getBalance();
      // set({ balance: data.balance, pending: data.pending, totalEarned: data.totalEarned });
    } finally {
      set({ isLoading: false });
    }
  },

  requestWithdrawal: async (amount) => {
    // TODO: await walletApi.requestWithdrawal(amount);
  },

  fetchTransactionHistory: async () => {
    set({ isLoading: true });
    try {
      // TODO: const txs = await walletApi.getTransactions();
      // set({ transactions: txs });
    } finally {
      set({ isLoading: false });
    }
  },
}));
