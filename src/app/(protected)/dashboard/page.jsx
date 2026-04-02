"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Zap, Ticket, TrendingUp, BarChart3, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useAuthStore } from "@/store/authStore";
import { ReferralBanner } from "@/components/referral/referral-banner";
import { useReferrableEvents, useEventStats } from "@/lib/hooks/useReferralQueries";
import { TicketsTable } from "@/components/referral/tickets-table";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, fetchProfile, isAuthenticated } = useAuthStore();
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // Ensure profile is loaded on mount
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  // Fetch events
  const { data: eventsResponse, isLoading: isLoadingEvents } = useReferrableEvents();
  const eventsData = Array.isArray(eventsResponse?.events) ? eventsResponse.events : (Array.isArray(eventsResponse) ? eventsResponse : []);
  const referrableEvents = eventsData.filter((evt) => evt.use_referral === true);

  // Auto-select first event
  useEffect(() => {
    if (referrableEvents.length > 0 && !selectedEventId) {
      setSelectedEventId(referrableEvents[0].event_id || referrableEvents[0].id);
    }
  }, [referrableEvents, selectedEventId]);

  // Fetch stats for selected event
  const { 
    data: stats, 
    isLoading: isLoadingStats,
    isFetching
  } = useEventStats(selectedEventId);

  // Extract display name
  const userName = user?.name 
    ? user.name.split(" ")[0] 
    : (user?.Firstname || user?.firstname || "Partner");

  const displayRevenue = stats?.referral_revenue != null && stats.referral_revenue !== 0 
    ? `₦${Number(stats.referral_revenue).toLocaleString()}` 
    : "--";
    
  const displayTicketsSold = stats?.tickets_sold != null 
    ? Number(stats.tickets_sold) 
    : 0;

  const tickets = Array.isArray(stats?.tickets) ? stats.tickets : [];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-24 px-4 sm:px-6">

      {/* Branded Banner */}
      <ReferralBanner />

      {/* Enhanced Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5 relative">
        <div className="space-y-3 flex-1">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <Zap size={12} className="text-primary fill-current" />
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Verified Partner Account</span>
           </div>
           <h1 className="text-4xl font-semibold tracking-tight text-white/95">Welcome back, {userName}</h1>
           <p className="text-gray-400 text-[15px] font-medium">Track your referral conversions and revenue in real-time.</p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <Link href="/dashboard/events">
                 <Compass className="mr-2" size={20} /> Browse Marketplace
              </Link>
          </Button>
        </div>
      </div>

      {isLoadingEvents ? (
        <div className="h-[400px] flex items-center justify-center">
           <div className="animate-pulse flex flex-col items-center gap-4 text-gray-500">
             <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             <p>Loading dashboard...</p>
           </div>
        </div>
      ) : referrableEvents.length === 0 ? (
        <div className="bg-[#12121f] border border-white/5 rounded-2xl p-10 text-center space-y-4">
           <h3 className="text-xl font-bold text-white">No active referral events</h3>
           <p className="text-gray-400 max-w-sm mx-auto">You do not have any referrable events available. Discover new events in the marketplace to start earning.</p>
           <Button asChild variant="outline" className="mt-4 border-white/10 hover:bg-white/5 rounded-full px-8">
              <Link href="/dashboard/events">Go to Marketplace</Link>
           </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Event Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-white tracking-tight">Performance Overview</h2>
             </div>
             
             <div className="relative min-w-[250px]">
                <select 
                  value={selectedEventId || ""} 
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full appearance-none bg-[#12121f] border border-white/10 text-white text-sm font-medium rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                >
                  {referrableEvents.map(evt => (
                    <option key={evt.event_id || evt.id} value={evt.event_id || evt.id}>
                      {evt.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#0a0a14] to-[#12121f] border border-white/5 shadow-lg rounded-3xl p-8 relative overflow-hidden group hover:border-white/10 transition-colors"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Ticket className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Tickets Sold</span>
                {isLoadingStats ? (
                  <div className="h-14 w-24 bg-white/5 rounded-lg animate-pulse" />
                ) : (
                  <div className="text-6xl font-black text-white">{displayTicketsSold}</div>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-primary/10 to-[#12121f] border border-primary/20 shadow-lg shadow-primary/5 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/40 transition-colors"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-sm font-bold text-primary uppercase tracking-wider flex items-center justify-between">
                  Total Revenue Generated
                  {isFetching && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full animate-pulse">Syncing...</span>}
                </span>
                {isLoadingStats && !stats ? (
                   <div className="h-14 w-48 bg-white/5 rounded-lg animate-pulse" />
                ) : (
                   <div className="text-5xl sm:text-6xl font-black text-white tracking-tight">{displayRevenue}</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Two Column Layout: Activity & Promotion */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10 items-start">
              {/* Main Activity History */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Recent Sales</h3>
                    <Link href={`/dashboard/events/${selectedEventId}/stats`} className="text-sm text-primary hover:text-primary/80 font-bold transition-colors">
                      View Full Details →
                    </Link>
                 </div>
                 
                 {isLoadingStats ? (
                   <div className="h-64 bg-[#0a0a14] border border-white/5 rounded-2xl animate-pulse" />
                 ) : displayTicketsSold === 0 ? (
                   <div className="h-48 bg-[#0a0a14] border border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                      <Ticket className="w-8 h-8 mb-2 opacity-50" />
                      <p>No tickets sold for this event yet.</p>
                   </div>
                 ) : (
                   <TicketsTable tickets={tickets.slice(0, 5)} />
                 )}
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
                            <Link href={`/dashboard/events/${selectedEventId}/stats`}>
                               Get Referral Link →
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
      )}
    </div>
  );
}
