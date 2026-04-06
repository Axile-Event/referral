"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp,
  Search,
  ArrowUpRight,
  Calendar,
  Zap,
  MousePointer2
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useUserReferrals } from "@/lib/hooks/useReferralQueries";

export default function ReferralsPage() {
  const { data: userReferrals, isLoading } = useUserReferrals();
  const [search, setSearch] = useState("");

  // Filter referrals based on search
  const filteredReferrals = (userReferrals || []).filter(ref => {
    const eventName = ref.event?.name?.toLowerCase() || "";
    return eventName.includes(search.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-500 font-medium text-sm">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20 px-4 sm:px-6">
      
      {/* Enhanced Portfolio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2 lg:px-4">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-semibold border border-primary/20">
               <Zap size={12} className="fill-current" /> Direct Referrals
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white/95">Campaign portfolio</h1>
            <p className="text-gray-500 text-sm font-medium max-w-md leading-relaxed">
              Manage your unique promotional assets and track their individual performance metrics.
            </p>
         </div>

         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={16} />
               <Input 
                 placeholder="Search campaigns..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full sm:w-[300px] bg-white/[0.03] border-white/5 h-12 rounded-xl pl-12 text-sm text-white focus:border-primary/50 transition-all placeholder:text-gray-600"
               />
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 shadow-lg shadow-primary/20 active:scale-95 transition-all">
               <Link href="/events/referral-enabled">
                Browse programs
               </Link>
            </Button>
         </div>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredReferrals.map((event) => {
          const stats = event.stats || {};

          const ticketsSold = stats.tickets_sold || 0;
          const revenue = stats.referral_revenue || 0;
          const status = "Active";

          return (
            <div 
              key={event.event_id}
              className="group relative bg-[#12121f] rounded-[32px] border border-white/5 hover:border-white/15 transition-colors duration-300 flex flex-col h-full overflow-hidden shadow-lg"
            >
              <div className="h-48 relative overflow-hidden bg-black/40 border-b border-white/5">
                <img 
                  src={event.image || "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?w=800"} 
                  alt={event.name}
                  className="w-full h-full object-cover grayscale-[0.15] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40" />
                
                <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-white/80">{status}</span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight line-clamp-1">{event.name}</h3>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-2 font-medium">
                    <Calendar size={12} className="text-primary" /> {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl group-hover:border-primary/10 transition-colors">
                    <p className="text-[11px] font-medium text-gray-400 mb-1.5">Tickets sold</p>
                    <p className="text-lg font-bold text-white">{ticketsSold}</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl group-hover:border-primary/10 transition-colors">
                    <p className="text-[11px] font-medium text-gray-400 mb-1.5">Revenue</p>
                    <p className="text-lg font-bold text-emerald-400">₦{revenue.toLocaleString()}</p>
                  </div>
                </div>

                <Button asChild variant="outline" className="mt-auto h-14 rounded-2xl border-white/5 hover:border-primary/50 hover:bg-primary/5 text-white/80 hover:text-white font-semibold text-xs flex items-center justify-between px-6 transition-colors active:scale-95">
                  <Link href={`/dashboard/referrals/${event.event_id}`}>
                    Performance stats
                    <ArrowUpRight size={18} className="text-primary" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}

        {/* Dynamic Placeholder for Empty Opportunities */}
        <Link 
          href="/dashboard/events" 
           className="group relative border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center p-12 text-center space-y-6 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300 min-h-[400px] shadow-lg"
        >
            <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-gray-600 group-hover:text-primary group-hover:scale-105 transition-all duration-500">
              <MousePointer2 size={36} />
           </div>
           <div>
              <p className="text-white font-semibold text-lg">Launch new program</p>
                <p className="text-sm text-gray-500 mt-2 max-w-[220px] mx-auto font-medium leading-relaxed">Discover new opportunities and start a referral campaign.</p>
           </div>
              <span className="text-primary text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity mt-4 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">View programs</span>
        </Link>
      </div>

    </div>
  );
}
