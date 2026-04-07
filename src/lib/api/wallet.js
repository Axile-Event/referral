import apiClient from "./client";

/**
 * Wallet API Methods (Based on PRD)
 * - GET  /wallet           → getBalance / getStats
 * - GET  /wallet/history   → getTransactions
 * - POST /withdrawals      → requestWithdrawal
 */
export const walletApi = {
  // GET /referee/wallet/ → Balance & Bank details
  getBalance: () => apiClient.get("/referee/wallet/").then((r) => r.data),

  // GET /referee/wallet/transactions/ → History
  getTransactions: (params = {}) => 
    apiClient.get("/referee/wallet/transactions/", { params }).then((r) => r.data),

  // GET /referee/wallet/payout-requests/ → History
  getPayoutRequests: (params = {}) => 
    apiClient.get("/referee/wallet/payout-requests/", { params }).then((r) => r.data),

  // PATCH /referee/wallet/bank-account/ → Save bank details
  updateBankAccount: (data) =>
    apiClient.patch("/referee/wallet/bank-account/", data).then((r) => r.data),

  // POST /referee/wallet/withdraw/ → Trigger payout request
  requestWithdrawal: (data) =>
    apiClient.post("/referee/wallet/withdraw/", data).then((r) => r.data),

  // GET /banks/ → Fetching from Paystack Public API as per option 1
  getBanks: () => 
    require("axios").get("https://api.paystack.co/bank").then((r) => r.data.data),

  // POST /bank/verify/ → Verify account number and get account name
  verifyBank: (data) =>
    apiClient.post("/bank/verify/", data).then((r) => r.data),
};
