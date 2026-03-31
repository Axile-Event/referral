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

/**
 * Robust Wallet Page
 * Aligned with Points Wallet design from image.
 */
export default function WalletPage() {
  const { 
    balance, 
    pending, 
    totalWithdrawn, 
    transactions, 
    isLoading, 
    fetchWalletData, 
    fetchTransactionHistory,
    apToNaira,
    requestWithdrawal 
  } = useWalletStore();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);

  useEffect(() => {
    fetchWalletData();
    fetchTransactionHistory();
  }, []);

  const handleWithdrawal = async (amount) => {
    const res = await requestWithdrawal(amount, { source: "primary_bank" });
    if (res.success) {
      toast.success("Withdrawal request submitted!");
      fetchWalletData();
      fetchTransactionHistory();
    } else {
      toast.error(res.error || "Withdrawal failed");
    }
  };

  const handleAddBank = async (bankData) => {
    console.log("Adding bank:", bankData);
    toast.success(`Bank ${bankData.bankName} linked successfully!`);
    // Logic to save bank details would go here
  };

  return (
    <div className="space-y-10 p-2 sm:p-4 lg:p-0 relative">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">Points Wallet</h1>
          <p className="text-gray-400 font-medium text-sm tracking-tight leading-relaxed">
            Manage your earned points. 10 AP = ₦100. Min withdrawal: 50 AP.
          </p>
        </div>
        <button 
          onClick={() => setIsAddBankOpen(true)}
          className="flex items-center gap-2 bg-[#e11d48] text-white px-6 h-12 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-fit"
        >
          <Plus size={18} />
          Add Bank
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
        <div className="xl:col-span-2 flex">
           <WalletCard 
              balance={balance} 
              nairaVal={apToNaira(balance)} 
              onWithdraw={() => setIsWithdrawOpen(true)}
              onViewReports={() => toast("Report feature coming soon!")}
           />
        </div>
        
        <div className="flex flex-col gap-6">
           <StatCard 
              label="PENDING AP" 
              value={pending} 
              icon={Clock} 
           />
           <StatCard 
              label="TOTAL WITHDRAWN" 
              value={totalWithdrawn} 
              icon={Landmark}
           />
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <History size={18} />
           </div>
           <h3 className="text-xl font-bold text-white tracking-tight">Transaction History</h3>
        </div>
        
        <TransactionList transactions={transactions} />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isWithdrawOpen && (
          <WithdrawModal 
            isOpen={isWithdrawOpen} 
            onClose={() => setIsWithdrawOpen(false)}
            balance={balance}
            apToNaira={apToNaira}
            onWithdraw={handleWithdrawal}
          />
        )}
        {isAddBankOpen && (
          <AddBankModal 
            isOpen={isAddBankOpen}
            onClose={() => setIsAddBankOpen(false)}
            onSubmit={handleAddBank}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
