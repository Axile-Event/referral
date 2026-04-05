import { create } from "zustand";
import { walletApi } from "@/lib/api/wallet";

/**
 * Wallet Store (Zustand)
 *
 * State: balance, pending, totalEarned, transactions[], isLoading
 * Actions: fetchWalletData, requestWithdrawal, fetchTransactionHistory
 */
export const useWalletStore = create((set) => ({
  balance: 0, // In Naira
  pending: 0, // In Naira
  totalWithdrawn: 0, // In Naira
  transactions: [],
  isLoading: false,

  fetchWalletData: async () => {
    set({ isLoading: true });
    try {
      // Assuming getBalance returns all stats in Naira now
      const data = await walletApi.getBalance();
      set({ 
        balance: data.balance || 0, 
        pending: data.pending || 0, 
        totalWithdrawn: data.totalWithdrawn || 0 
      });
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  requestWithdrawal: async (amount, bankDetails) => {
    try {
      await walletApi.requestWithdrawal(amount, bankDetails);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  fetchTransactionHistory: async () => {
    set({ isLoading: true });
    try {
      const txs = await walletApi.getTransactions();
      set({ transactions: txs });
    } catch (error) {
      console.error("Failed to fetch transaction history:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
