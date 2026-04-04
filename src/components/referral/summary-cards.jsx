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

  const cards = [
    {
      title: "Total Clicks",
      value: formatValue(stats?.total_clicks),
      icon: MousePointerClick,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Conversions",
      value: formatValue(stats?.total_conversions !== undefined ? stats.total_conversions : stats?.tickets_sold),
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Pending",
      value: formatValue(stats?.pending_conversions),
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Checked In",
      value: formatValue(stats?.checked_in_referrals),
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
          className="bg-[#12121f] border border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:border-white/10 transition-colors"
        >
          <div className={cn("p-4 rounded-xl", card.bg, card.color)}>
            <card.icon size={24} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-400 tracking-wide uppercase">{card.title}</p>
            <p className="text-3xl font-bold text-white leading-none mt-1">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
