"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Compass, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useAuthStore } from "@/store/authStore";
import { ReferralBanner } from "@/components/referral/referral-banner";
import { SummaryCards } from "@/components/referral/summary-cards";
import { ActivityTable } from "@/components/referral/activity-table";

/**
 * DashboardPage
 */
export default function DashboardPage() {
  const { user, fetchProfile, isAuthenticated } = useAuthStore();
  
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
    <div className="w-full space-y-8 animate-fade-in pb-24">
      {/* Banner & Header Section */}
      <div className="space-y-4">
        <ReferralBanner />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5 relative px-4 sm:px-6">
        <div className="space-y-3">
           <h1 className="text-4xl font-semibold tracking-tight text-white/95">Welcome back, {userName}</h1>
           <p className="text-gray-400 text-[15px] font-normal">Track referral performance across your events.</p>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <Link href="/events/referral-enabled">
                         <Compass className="mr-2" size={20} /> Explore events
              </Link>
          </Button>
        </div>
      </div>
      </div>

      {/* Summary Metrics */}
      <div className="space-y-4 px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
           <TrendingUp size={16} className="text-primary" />
                <p className="text-[12px] font-semibold text-white/40 uppercase tracking-wide">Performance overview</p>
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
              <div className="bg-[#12121f] border border-white/5 rounded-2xl p-8 relative overflow-hidden group shadow-lg">
                  <div className="relative z-10 space-y-6">
                     <p className="text-sm text-white/40 font-medium">Networking tip</p>
                     <p className="text-[16px] text-white/90 leading-relaxed font-medium">
                        Personalize invites on LinkedIn and WhatsApp to improve conversion rates.
                     </p>
                     <Button asChild variant="ghost" className="p-0 text-primary hover:text-primary/80 hover:bg-transparent font-semibold">
                        <Link href="/events/referral-enabled">
                           View promotion guide →
                        </Link>
                     </Button>
                  </div>
              </div>

              {/* Economy Placeholder (Future Reward System) */}
              <div className="p-8 bg-[#0C0C14] rounded-2xl border border-white/5 relative overflow-hidden border-dashed opacity-80">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-4">Financial infrastructure (locked)</p>
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
