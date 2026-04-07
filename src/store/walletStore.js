import { create } from "zustand";
import { walletApi } from "@/lib/api/wallet";

/**
 * Wallet Store (Zustand)
 *
 * State: balance, pending, totalEarned, transactions[], isLoading
 * Actions: fetchWalletData, requestWithdrawal, fetchTransactionHistory
 */
export const useWalletStore = create((set, get) => ({
  // Core Stats
  availableBalance: 0,
  totalEarnings: 0,
  totalWithdrawn: 0,
  
  // Bank Info
  hasBankAccount: false,
  bankName: "",
  accountName: "",
  bankAccountLast4: "",
  
  // Lists
  transactions: [],
  payoutRequests: [],
  banks: [],
  
  isLoading: false,
  error: null,

  /**
   * Fetch balance and account settings
   */
  fetchWalletData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await walletApi.getBalance();
      console.log("Raw Backend Wallet Data:", data);
      
      set(state => ({ 
        availableBalance: parseFloat(data.available_balance || 0) || state.availableBalance,
        totalEarnings: parseFloat(data.total_earnings || 0) || state.totalEarnings,
        totalWithdrawn: parseFloat(data.total_withdrawn || 0) || state.totalWithdrawn,
        hasBankAccount: data.has_bank_account !== undefined ? data.has_bank_account : state.hasBankAccount,
        bankName: data.bank_name || state.bankName,
        accountName: data.account_name || state.accountName,
        bankAccountLast4: data.bank_account_last4 || state.bankAccountLast4,
      }));
    } catch (error) {
      console.error("Failed to fetch wallet info:", error);
      set({ error: "Failed to load wallet balance" });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetch transaction history
   */
  fetchTransactions: async (params) => {
    set({ isLoading: true });
    try {
      const data = await walletApi.getTransactions(params);
      console.log("Raw Earnings API Response:", data);
      
      // Attempt to extract the list from various possible DRF/Django formats
      const list = Array.isArray(data) ? data : (
          data.results || 
          data.transactions || 
          data.data?.results || 
          data.data || 
          []
      );
      
      console.log("Extracted Earnings List:", list);
      
      // Fallback calculation: if backend wallet balance API is delayed/0, 
      // compute totals directly from the transactions array
      const calculatedEarnings = list.reduce((sum, tx) => {
         const amount = parseFloat(tx.amount || tx.referral_revenue || 0);
         
         let status = tx.status_display || tx.status;
         if (!status && tx.tickets && tx.tickets.length > 0) {
            // Count "confirmed" or "used" tickets as completed
            status = tx.tickets.some(t => ["confirmed", "used", "checked_in"].includes(t.status?.toLowerCase())) 
                     ? "completed" : "pending";
         } else if (!status) {
            status = "completed";
         }
         
         return (status === "completed" || status === "successful") ? sum + amount : sum;
      }, 0);

      set(state => ({ 
         transactions: list,
         // Auto-sync dashboard aggregate if backend wallet is lagging
         totalEarnings: state.totalEarnings > 0 ? state.totalEarnings : calculatedEarnings, 
         availableBalance: state.availableBalance > 0 ? state.availableBalance : (calculatedEarnings - state.totalWithdrawn)
      }));
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetch payout requests (Withdrawal history)
   */
  fetchPayoutRequests: async (params) => {
    try {
      const data = await walletApi.getPayoutRequests(params);
      const list = Array.isArray(data) ? data : (data.results || data.payout_requests || data.data || []);
      set({ payoutRequests: list });
    } catch (error) {
      console.error("Failed to fetch payout requests:", error);
    }
  },

  /**
   * Update Bank Account
   */
  updateBankDetails: async (bankData) => {
    set({ isLoading: true });
    try {
      // Maps frontend camelCase to snake_case for API
      const payload = {
        bank_account_number: bankData.accountNumber,
        bank_name: bankData.bankName,
        account_name: bankData.accountName,
        bank_code: bankData.bankCode || "",
      };
      const res = await walletApi.updateBankAccount(payload);
      // Refresh wallet state
      await get().fetchWalletData();
      return { success: true, message: res.message };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update bank account";
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Request Payout (Withdrawal)
   */
  withdraw: async (amount) => {
    set({ isLoading: true });
    try {
      const res = await walletApi.requestWithdrawal({ amount });
      await get().fetchWalletData(); // Refresh balance
      await get().fetchPayoutRequests(); // Refresh list
      return { success: true, message: res.message };
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Withdrawal failed";
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetch list of supported banks
   */
  fetchBanks: async () => {
    try {
      const data = await walletApi.getBanks();
      // Assume data is an array or { banks: [] }
      const bankList = Array.isArray(data) ? data : data.banks || [];
      set({ banks: bankList });
    } catch (error) {
      console.error("Failed to fetch banks:", error);
    }
  },

  /**
   * Verify Bank Account Details
   */
  verifyBankAccount: async (accountNumber, bankCode) => {
    set({ isLoading: true });
    try {
      const res = await walletApi.verifyBank({ 
        account_number: accountNumber, 
        bank_code: bankCode 
      });
      
      // Extremely flexible check to match res.data?.data?.account_name structure
      // If res is the body, res.data.account_name maps to body.data.account_name
      const accountName = res?.data?.account_name || res?.account_name || (res?.data && typeof res.data === 'string' ? res.data : null);
      
      if (accountName) {
        return { 
          success: true, 
          accountName: accountName,
          message: "Account name detected"
        };
      } else {
        return { 
          success: false, 
          error: "Could not detect account name" 
        };
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || "Bank verification failed";
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },
}));
