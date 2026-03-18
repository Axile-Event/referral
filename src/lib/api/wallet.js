import apiClient from "./client";

/**
 * Wallet API Methods
 * - GET  /wallet/balance      → getBalance
 * - GET  /wallet/transactions → getTransactions
 * - POST /wallet/withdraw     → requestWithdrawal
 * - GET  /wallet/stats        → getStats
 */
export const walletApi = {
  getBalance: () => apiClient.get("/wallet/balance").then((r) => r.data),

  getTransactions: () => apiClient.get("/wallet/transactions").then((r) => r.data),

  requestWithdrawal: (amount, bankDetails) =>
    apiClient.post("/wallet/withdraw", { amount, bankDetails }).then((r) => r.data),

  getStats: () => apiClient.get("/wallet/stats").then((r) => r.data),
};
