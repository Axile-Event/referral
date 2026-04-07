"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  History,
  Clock,
  Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { WalletCard } from "@/components/wallet/wallet-card.jsx";
import { StatCard } from "@/components/wallet/stat-card.jsx";
import { TransactionList } from "@/components/wallet/transaction-list.jsx";
import { useWalletStore } from "@/store/walletStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import { WithdrawModal } from "@/components/wallet/withdraw-modal.jsx";
import { AddBankModal } from "@/components/wallet/add-bank-modal.jsx";

import { useRefereeStats, useRefereeEarningsList } from "@/lib/hooks/useReferralQueries";

/**
 * Robust Wallet Page
 * Aligned with Earnings Wallet design.
 */
export default function WalletPage() {
  const { 
    availableBalance: storeBalance, 
    totalEarnings: storeTotalEarnings, 
    totalWithdrawn, 
    transactions, 
    payoutRequests,
    hasBankAccount,
    bankName,
    bankAccountLast4,
    fetchWalletData, 
    fetchTransactions,
    fetchPayoutRequests
  } = useWalletStore();

  const { data: dashboardStats } = useRefereeStats();
  const { data: fallbackEarnings } = useRefereeEarningsList();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");

  // Pending payouts to visually deduct (backend doesn't debit until admin approves)
  const pendingPayoutsAmount = payoutRequests?.reduce((sum, req) => {
     return req.status?.toLowerCase() === 'pending' ? sum + parseFloat(req.amount || 0) : sum;
  }, 0) || 0;

  // Use correct field names from /referee/dashboard/stats/
  const displayEarnings = parseFloat(dashboardStats?.total_referral_earnings ?? storeTotalEarnings ?? 0);
  const backendBalance = parseFloat(storeBalance ?? 0);
  const displayBalance = Math.max(0, backendBalance - pendingPayoutsAmount);

  // Earnings history: wallet transactions > dashboard recent_activity > event fallback
  const recentActivity = dashboardStats?.recent_activity || [];
  const displayTransactions = transactions?.length > 0 
    ? transactions 
    : recentActivity.length > 0 
      ? recentActivity 
      : (fallbackEarnings || []);

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
    fetchPayoutRequests();
  }, [fetchWalletData, fetchTransactions, fetchPayoutRequests]);

  return (
    <div className="space-y-8 p-2 sm:p-4 lg:p-0 relative">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
             Earnings Wallet
          </h1>
          <p className="text-gray-400 font-medium text-sm tracking-tight leading-relaxed max-w-lg">
            Manage your commissions and request payouts.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <AnimatePresence>
             {hasBankAccount && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex flex-col items-end px-6 py-3 border border-white/5 rounded-2xl bg-white/5"
               >
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Settlement Bank</span>
                 <span className="text-sm font-semibold text-white/90">{bankName} ••••{bankAccountLast4}</span>
               </motion.div>
             )}
          </AnimatePresence>
          <button 
            onClick={() => setIsAddBankOpen(true)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 h-12 rounded-2xl text-sm font-bold hover:bg-white/10 active:scale-95 transition-all w-fit"
          >
            <Plus size={18} />
            {hasBankAccount ? "Change Bank" : "Add Bank Account"}
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
        <div className="xl:col-span-2 flex">
           <WalletCard 
              balance={displayBalance} 
              onWithdraw={() => {
                if (!hasBankAccount) {
                  toast.error("Please add a bank account first");
                  setIsAddBankOpen(true);
                } else {
                  setIsWithdrawOpen(true);
                }
              }}
              onViewReports={() => setActiveTab("payouts")}
           />
        </div>
        
        <div className="flex flex-col gap-6 h-full">
           <StatCard 
              label="TOTAL EARNINGS" 
              value={displayEarnings} 
              icon={Clock} 
           />
           <StatCard 
              label="TOTAL WITHDRAWN" 
              value={totalWithdrawn} 
              icon={Landmark}
           />
           {/* New Info Box filling the empty desktop space */}
           <div className="flex-1 bg-[#10121d] border border-white/5 rounded-3xl p-6 flex flex-col justify-center space-y-3">
              <h4 className="text-sm font-bold text-white mb-1">💡 Wallet Rules</h4>
              <ul className="text-xs font-medium text-gray-400 space-y-2 list-disc list-inside">
                 <li>Minimum withdrawal is ₦1,000.</li>
                 <li>Payouts take up to 24-48 hours.</li>
                 <li>Bank account name must match your ID.</li>
              </ul>
           </div>
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
           <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold text-white tracking-tight">Records</h3>
              <div className="h-5 w-px bg-white/10 hidden sm:block" />
              <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
                 <button 
                   onClick={() => setActiveTab("transactions")}
                   className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "transactions" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-white"}`}
                 >
                   Earnings
                 </button>
                 <button 
                   onClick={() => setActiveTab("payouts")}
                   className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "payouts" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-white"}`}
                 >
                   Payout History
                 </button>
              </div>
           </div>
        </div>
        
        <div className="min-h-[400px]">
           {activeTab === "transactions" ? (
             <TransactionList transactions={displayTransactions} type="earnings" />
           ) : (
             <TransactionList transactions={payoutRequests} type="payouts" />
           )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isWithdrawOpen && (
          <WithdrawModal 
            isOpen={isWithdrawOpen} 
            onClose={() => setIsWithdrawOpen(false)}
            availableBalance={displayBalance}
          />
        )}
        {isAddBankOpen && (
          <AddBankModal 
            isOpen={isAddBankOpen}
            onClose={() => setIsAddBankOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
