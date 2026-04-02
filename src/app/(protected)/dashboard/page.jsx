"use client";
import { useEffect } from "react";
import React from "react";
import Link from "next/link";
import {
  Ticket, TrendingUp, Wallet, Activity, Compass, User, Users, MousePointerClick, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useAuthStore } from "@/store/authStore";
import { useReferralStore } from "@/store/referralStore";
import { useWalletStore } from "@/store/walletStore";
import { ReferralBanner } from "@/components/referral/referral-banner";

export default function DashboardPage() {
  const { user, fetchProfile, isAuthenticated } = useAuthStore();
  
  // Debug user details for referral handle identification
  React.useEffect(() => {
    if (user) console.log("Current Authenticated User (Event Details):", user);
  }, [user]);

  const { 
    referrableEvents, 
    eventStats, 
    stats, 
    fetchReferrableEvents, 
    fetchEventStats, 
    calculateGlobalStats, 
    isLoading: isReferralLoading 
  } = useReferralStore();
  const { 
    balance, 
    pending, 
    totalWithdrawn: totalWithdrawnAP, 
    fetchWalletData, 
    fetchTransactionHistory,
    isLoading: isWalletLoading,
    apToNaira
  } = useWalletStore();
  
  // Extract first name from user profile (ensure we capture it properly)
  const userName = user?.name 
    ? user.name.split(" ")[0] 
    : (user?.Firstname || user?.firstname || "Partner");

  useEffect(() => {
    // Ensure profile is loaded on dashboard mount
    if (isAuthenticated && !user) {
      fetchProfile();
    }
    fetchWalletData();
    fetchTransactionHistory();
  }, [isAuthenticated, user, fetchProfile, fetchWalletData, fetchTransactionHistory]);

  const formatAP = (val) => `${(val || 0).toLocaleString()} AP`;
  const formatNaira = (val) => `≈ ₦${(apToNaira(val) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  const formatCurrency = (val) => `₦${(val || 0).toLocaleString()}`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">

      {/* Referral Banner */}
      <ReferralBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
        <div>
           <h1 className="text-3xl font-medium tracking-tight text-white/95 mb-2">Welcome back, {userName}</h1>
           <p className="text-gray-400">Track your referrals, commissions, and upcoming payouts.</p>
        </div>

        <Button asChild className="bg-[#e11d48] hover:bg-[#e11d48]/90 text-white rounded-lg px-6 h-11 shrink-0">
            <Link href="/events/referral-enabled">
               <Compass className="mr-2" size={18} /> Discover Events
            </Link>
        </Button>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Referrals"
          value={stats.totalReferrals || 0}
          icon={Users}
          color="text-violet-400"
          bg="bg-violet-500/10"
        />
        <StatCard
          title="Total Clicks"
          value={stats.totalClicks || 0}
          icon={MousePointerClick}
          color="text-sky-400"
          bg="bg-sky-500/10"
        />
        <StatCard
          title="Tickets Sold"
          value={stats.totalTicketsSold || 0}
          icon={Ticket}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <StatCard
          title="Referral Earnings"
          value={formatAP(stats.totalEarnings)}
          icon={DollarSign}
          color="text-primary"
          bg="bg-primary/10"
        />
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          title="Available Balance" 
          value={formatAP(balance)} 
          subtitle={formatNaira(balance)}
          icon={Wallet} 
          color="text-primary" 
          bg="bg-primary/10" 
        />
        <StatCard 
          title="Pending Rewards" 
          value={formatAP(pending)} 
          subtitle={formatNaira(pending)}
          icon={Activity} 
          color="text-blue-500" 
          bg="bg-blue-500/10" 
        />
        <StatCard 
          title="Total Withdrawn" 
          value={formatAP(totalWithdrawnAP)} 
          subtitle={formatNaira(totalWithdrawnAP)}
          icon={Ticket} 
          color="text-green-500" 
          bg="bg-green-500/10" 
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="bg-[#12121f] rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
               <h3 className="font-semibold text-white">Active Campaigns</h3>
               <Link href="/dashboard/referrals" className="text-sm text-primary hover:underline font-bold">
                  View All
               </Link>
            </div>

            {referrableEvents?.length > 0 ? (
              <div className="divide-y divide-white/5">
                {referrableEvents.map((ev) => {
                  const s = eventStats[ev.event_id] || {};
                  // Only show if there's any activity or stats known
                  if (!s.tickets_sold && s.tickets_sold !== 0) return null;

                  return (
                    <div key={ev.event_id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Ticket size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{ev.name}</p>
                          <p className="text-xs text-gray-500">
                             {ev.referral_reward_type === 'percentage' 
                               ? `${ev.referral_reward_percentage}% Reward` 
                               : `₦${ev.referral_reward_amount?.toLocaleString()} Flat`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-white">{formatCurrency(s.referral_revenue)}</p>
                        <p className="text-xs text-gray-500">{s.tickets_sold || 0} sold</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-20 text-center text-gray-400">
                <Ticket size={40} className="mb-4 opacity-30" />
                <p className="text-white font-medium mb-1">No active referrals yet</p>
                <p className="text-sm mb-6">Start sharing event links to earn commissions.</p>
                <Button asChild variant="outline" className="border-white/10 text-white rounded-xl">
                  <Link href="/dashboard/referrals">
                    Browse Events
                  </Link>
                </Button>
              </div>
            )}
         </div>

         {/* Right Sidebar Widget */}
         <div className="space-y-6">
             <div className="bg-[#12121f] border border-white/5 rounded-2xl p-6">
                 <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                        <User size={24} />
                     </div>
                     <div>
                         <p className="text-sm text-gray-400">Network Tier</p>
                         <p className="font-bold text-white text-lg">Partner</p>
                     </div>
                 </div>

                 <div className="space-y-2">
                     <div className="flex justify-between text-xs font-medium">
                         <span className="text-gray-400">Performance Index</span>
                         <span className="text-primary">High</span>
                     </div>
                     <div className="h-2 w-full bg-[#1c1c28] rounded-full overflow-hidden">
                         <div className="w-full h-full bg-primary rounded-full transition-all" />
                     </div>
                 </div>
             </div>

             <div className="bg-[#1c1c28] rounded-2xl p-5 border border-white/5 flex gap-4">
                 <TrendingUp size={20} className="text-primary shrink-0" />
                 <p className="text-sm text-gray-400 leading-relaxed">
                    <span className="text-white font-medium">Pro Tip: </span>
                    Share your links on professional networks alongside a personal note to increase conversion rates.
                 </p>
             </div>
         </div>
      </div>

    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, bg }) {
  return (
    <div className="bg-[#12121f] border border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white leading-none mt-1">{value}</p>
        {subtitle && <p className="text-xs font-semibold text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
