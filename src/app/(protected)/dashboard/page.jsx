"use client";

import React from "react";
import Link from "next/link";
import {
  Ticket, TrendingUp, Wallet, Activity, Compass, User, Users, MousePointerClick, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useAuthStore } from "@/store/authStore";
import { useReferralStore } from "@/store/referralStore";
import { ReferralBanner } from "@/components/referral/referral-banner";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { referrals, totalEarnings, isLoading } = useReferralStore();
  const userName = user?.name?.split(" ")[0] || "Ezekiel";

  // Derive stats from store
  const totalReferrals = referrals?.length ?? 0;
  const totalTicketsSold = referrals?.reduce((sum, r) => sum + (r.conversions || 0), 0) ?? 0;
  const formattedEarnings = `₦${(totalEarnings || 0).toLocaleString()}`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">

      {/* Referral Banner */}
      <ReferralBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userName}</h1>
           <p className="text-gray-400">Track your referrals, commissions, and upcoming payouts.</p>
        </div>

        <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 h-11 shrink-0">
            <Link href="/events/referral-enabled">
               <Compass className="mr-2" size={18} /> Discover Events
            </Link>
        </Button>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Referrals"
          value={totalReferrals}
          icon={Users}
          color="text-violet-400"
          bg="bg-violet-500/10"
        />
        <StatCard
          title="Total Clicks"
          value={referrals?.reduce((sum, r) => sum + (r.clicks || 0), 0) ?? 0}
          icon={MousePointerClick}
          color="text-sky-400"
          bg="bg-sky-500/10"
        />
        <StatCard
          title="Tickets Sold"
          value={totalTicketsSold}
          icon={Ticket}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <StatCard
          title="Total Earnings"
          value={formattedEarnings}
          icon={DollarSign}
          color="text-primary"
          bg="bg-primary/10"
        />
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Earnings" value={formattedEarnings} icon={Wallet} color="text-primary" bg="bg-primary/10" />
        <StatCard title="Pending Rewards" value="₦0" icon={Activity} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Withdrawable" value="₦0" icon={Ticket} color="text-green-500" bg="bg-green-500/10" />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="bg-[#12121f] rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
               <h3 className="font-semibold text-white">Active Referrals</h3>
               <Link href="/dashboard/referrals" className="text-sm text-primary hover:underline font-bold">
                  View All
               </Link>
            </div>

            {referrals?.length > 0 ? (
              <div className="divide-y divide-white/5">
                {referrals.map((ref) => (
                  <div key={ref.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Ticket size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{ref.name}</p>
                        <p className="text-xs text-gray-500">{ref.reward}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-white">{ref.earned}</p>
                      <p className="text-xs text-gray-500">{ref.conversions} sold</p>
                    </div>
                  </div>
                ))}
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
                         <p className="font-bold text-white text-lg">Rookie</p>
                     </div>
                 </div>

                 <div className="space-y-2">
                     <div className="flex justify-between text-xs font-medium">
                         <span className="text-gray-400">Progress to Next Tier</span>
                         <span className="text-primary">0 / 50 AP</span>
                     </div>
                     <div className="h-2 w-full bg-[#1c1c28] rounded-full overflow-hidden">
                         <div className="w-0 h-full bg-primary rounded-full transition-all" />
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

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-[#12121f] border border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
