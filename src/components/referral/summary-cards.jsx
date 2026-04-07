import React from "react";
import { MousePointerClick, TrendingUp, Clock, UserCheck } from "lucide-react";
import { useRefereeStats } from "@/lib/hooks/useReferralQueries";
import { useWalletStore } from "@/store/walletStore";
import { cn } from "@/lib/utils/cn";
import { useEffect } from "react";

/**
 * SummaryCards
 * Displays the 3 primary metrics for the referral dashboard.
 */
export function SummaryCards() {
  const { data: stats, isLoading, error } = useRefereeStats();
  const { availableBalance, payoutRequests, fetchWalletData, fetchPayoutRequests, totalWithdrawn } = useWalletStore();

  useEffect(() => {
     fetchWalletData();
     fetchPayoutRequests();
  }, [fetchWalletData, fetchPayoutRequests]);

  // Calculate pending payouts to visually deduct
  const pendingPayoutsAmount = payoutRequests?.reduce((sum, req) => {
     return req.status?.toLowerCase() === 'pending' ? sum + parseFloat(req.amount || 0) : sum;
  }, 0) || 0;

  // Synced deductive balance logic — use wallet store balance as source of truth
  const derivedBalance = availableBalance > 0 ? availableBalance : ((stats?.total_referral_earnings || 0) - totalWithdrawn);
  const accurateBalance = Math.max(0, derivedBalance - pendingPayoutsAmount);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[120px] bg-[#12121f] animate-pulse rounded-2xl border border-white/5" />
        ))}
      </div>
    );
  }

  // Handle missing as "--"
  const formatValue = (val) => {
    if (val === undefined || val === null) return "--";
    return val.toLocaleString();
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "₦0";
    return `₦${val.toLocaleString()}`;
  };

  const cards = [
    {
      title: "Tickets Sold",
      value: formatValue(stats?.total_tickets_sold),
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Revenue Generated",
      value: formatCurrency(stats?.total_referral_earnings),
      icon: MousePointerClick,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Available Balance",
      value: formatCurrency(accurateBalance),
      icon: UserCheck,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="bg-[#12121f] border border-white/5 p-5 rounded-2xl flex flex-col gap-4 shadow-lg hover:border-white/10 transition-colors"
        >
          <div className={cn("p-3 rounded-xl w-fit", card.bg, card.color)}>
            <card.icon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{card.title}</p>
            <p className="text-2xl font-black text-white leading-tight mt-1">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
