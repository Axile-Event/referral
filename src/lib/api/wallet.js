import apiClient from "./client";

/**
 * Wallet API Methods (Based on PRD)
 * - GET  /wallet           → getBalance / getStats
 * - GET  /wallet/history   → getTransactions
 * - POST /withdrawals      → requestWithdrawal
 */
export const walletApi = {
  getBalance: () => apiClient.get("/wallet/").then((r) => r.data),

  getTransactions: () => apiClient.get("/wallet/history/").then((r) => r.data),

  requestWithdrawal: (amount, bankDetails) =>
    apiClient.post("/withdrawals/", { amount, bankDetails }).then((r) => r.data),

  getStats: () => apiClient.get("/wallet/").then((r) => r.data),
};
