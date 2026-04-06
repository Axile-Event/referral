import React from "react";
import { MousePointerClick, TrendingUp, Clock, UserCheck } from "lucide-react";
import { useRefereeStats } from "@/lib/hooks/useReferralQueries";
import { cn } from "@/lib/utils/cn";

/**
 * SummaryCards
 * Displays the 4 primary metrics for the referral dashboard.
 * Sourced directly from GET /referee/stats/.
 */
export function SummaryCards() {
  const { data: stats, isLoading, error } = useRefereeStats();

  // If loading or error, we show the skeleton or fallback UI
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
      value: formatValue(stats?.tickets_sold),
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Revenue Generated",
      value: formatCurrency(stats?.referral_revenue),
      icon: MousePointerClick, // Or relevant icon
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Pending Rewards",
      value: formatCurrency(stats?.pending_earnings),
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Available Balance",
      value: formatCurrency(stats?.balance),
      icon: UserCheck,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
