"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Compass, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useAuthStore } from "@/store/authStore";
import { ReferralBanner } from "@/components/referral/referral-banner";
import { SummaryCards } from "@/components/referral/summary-cards";
import { ActivityTable } from "@/components/referral/activity-table";
import { useReferrableEvents, useEventStats } from "@/lib/hooks/useReferralQueries";

/**
 * DashboardPage
 */
export default function DashboardPage() {
  const { user, fetchProfile, isAuthenticated } = useAuthStore();
  
  // Debug: Trigger event list fetch to check for hidden stats
  useReferrableEvents();

  // Debug: Specifically check the 'event:EV-35925' (Phunk) stats
  const { data: statsData } = useEventStats("event:EV-35925");
  if (statsData) {
    console.log("DEBUG: Official Referral Stats Response:", statsData);
  }
  
  // Ensure profile is loaded on mount
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  // Extract display name
  const userName = user?.name 
    ? user.name.split(" ")[0] 
    : (user?.Firstname || user?.firstname || "Partner");

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-24 px-4 sm:px-6">

      {/* Branded Banner */}
      <ReferralBanner />

      {/* Enhanced Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5 relative">
        <div className="space-y-3">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <Zap size={12} className="text-primary fill-current" />
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Verified Partner Account</span>
           </div>
           <h1 className="text-4xl font-semibold tracking-tight text-white/95">Welcome back, {userName}</h1>
           <p className="text-gray-400 text-[15px] font-medium">Track your overall referral conversions across all events.</p>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <Link href="/events/referral-enabled">
                 <Compass className="mr-2" size={20} /> Discover New Events
              </Link>
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
           <TrendingUp size={16} className="text-primary" />
           <p className="text-[12px] font-extrabold text-white/30 uppercase tracking-[0.2em]">Lifecycle Performance</p>
        </div>
        <SummaryCards />
      </div>

      {/* Two Column Layout: Activity & Promotion */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10 items-start">
          
          {/* Main Activity History */}
          <div className="space-y-6">
             <ActivityTable />
          </div>

          {/* Right Sidebar: Utility & placeholders */}
          <div className="space-y-8 sticky top-8">
              
              {/* Promotion Widget */}
              <div className="bg-[#12121f] border border-white/5 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10 space-y-6">
                     <p className="text-sm text-white/40 font-semibold tracking-widest uppercase">Networking Tip</p>
                     <p className="text-[16px] text-white/90 leading-relaxed font-medium">
                        Personalize your invitations on LinkedIn and WhatsApp to achieve up to <span className="text-primary">3x higher</span> conversion rates.
                     </p>
                     <Button asChild variant="ghost" className="p-0 text-primary hover:text-primary/80 hover:bg-transparent font-bold">
                        <Link href="/events/referral-enabled">
                           View promotion guide →
                        </Link>
                     </Button>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
              </div>

              {/* Economy Placeholder (Future Reward System) */}
              <div className="p-8 bg-[#0C0C14] rounded-2xl border border-white/5 relative overflow-hidden border-dashed opacity-60 grayscale-[0.5]">
                  <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-4">Financial Infrastructure (Locked)</p>
                  <div className="space-y-4">
                     <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                     <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                  </div>
                  <p className="text-[12px] text-gray-500 mt-6 font-medium leading-relaxed">
                     Commissions and wallet withdrawal features are coming soon in the next update.
                  </p>
              </div>

          </div>
      </div>

    </div>
  );
}
