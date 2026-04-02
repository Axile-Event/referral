"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { 
  Users,
  Wallet,
  TrendingUp,
  Search,
  ArrowUpRight,
  Loader2,
  Calendar,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useReferral } from "@/lib/hooks/useReferral";

export default function ReferralsPage() {
  const { 
    referrableEvents,
    referrals,
    eventStats, 
    fetchReferrableEvents, 
    fetchUserReferrals,
    fetchEventStats, 
    isLoading 
  } = useReferral();

  useEffect(() => {
    const load = async () => {
      const events = await fetchReferrableEvents();
      if (events?.length > 0) {
        // Fetch stats for all events to see which ones are active/ours
        await Promise.all(events.map(ev => fetchEventStats(ev.event_id)));
      }
    };
    load();
  }, [fetchReferrableEvents, fetchUserReferrals, fetchEventStats]);

  const displayEvents = referrableEvents?.events || [];
  
  // We only show events that actually have some recorded performance (tickets sold) 
  // or that the user has interacted with (though the doc doesn't show "joined" state yet).
  // For now, let's show all events the user has stats for.
  const events = Array.isArray(referrableEvents) ? referrableEvents : (referrableEvents?.events || []);
  
  const activeReferrals = events.filter(ev => {
    const s = eventStats[ev.event_id];
    return s && (s.tickets_sold > 0 || s.tickets?.length > 0);
  });

  if (isLoading && activeReferrals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
         <div className="relative">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
            <Loader2 className="w-10 h-10 animate-spin text-primary absolute inset-0 [animation-delay:-0.5s]" />
         </div>
         <p className="mt-6 text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Loading Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20 px-4 sm:px-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
         <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
               Direct Referrals
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-white/95">Campaign Portfolio</h1>
            <p className="text-gray-500 text-sm font-medium max-w-md">Track, manage and optimize your promotional performance in real-time.</p>
         </div>

         <div className="flex items-center gap-3">
            <div className="relative group hidden sm:block">
               <div className="absolute -inset-[1px] bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500" />
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <Input 
                    placeholder="Search campaigns..." 
                    className="w-[260px] bg-white/[0.03] border-white/5 h-11 rounded-xl pl-11 text-sm text-white focus:ring-primary/20 transition-all placeholder:text-gray-600"
                  />
               </div>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 font-bold active:scale-95 transition-transform">
               <Link href="/events/referral-enabled">
                  <Zap size={14} className="mr-2 fill-current" /> Expand
               </Link>
            </Button>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
        {activeReferrals.map((ev) => {
          const stats = eventStats[ev.event_id] || {};
          const eventId = ev.event_id;
          const name = ev.name;
          const image = ev.image;
          const status = "Active";
          
          const reward = ev.referral_reward_type === 'percentage' 
            ? `${ev.referral_reward_percentage}%` 
            : `₦${ev.referral_reward_amount?.toLocaleString()}`;

          const conversions = stats.tickets_sold || 0;
          const earned = `₦${(stats.referral_revenue || 0).toLocaleString()}`;

          return (
            <div 
              key={eventId}
              className="group relative bg-[#12121f] rounded-[28px] border border-white/5 hover:border-primary/20 transition-all duration-500 flex flex-col h-full overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5" />
              
              <div className="h-44 relative overflow-hidden bg-black/40 border-b border-white/5">
                {image && (
                  <img 
                    src={image} 
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(227,54,41,0.8)]" />
                  <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">{status}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight line-clamp-1">{name}</h3>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10">
                        <TrendingUp size={10} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{reward}</span>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-2">
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl group-hover:bg-white/[0.04] transition-colors">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Conversions</p>
                    <p className="text-xl font-black text-white/90">{conversions}</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl group-hover:bg-white/[0.04] transition-colors">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Earnings</p>
                    <p className="text-xl font-black text-green-500">{earned}</p>
                  </div>
                </div>

                <Button asChild variant="outline" className="mt-auto h-12 rounded-xl border-white/10 hover:border-primary/50 hover:bg-primary/10 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-between px-5 transition-all group/btn active:scale-95">
                  <Link href={`/dashboard/referrals/${eventId}`}>
                    Campaign Stats
                    <ArrowUpRight size={16} className="text-primary transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}

        {/* Placeholder */}
        <Link 
          href="/events/referral-enabled" 
          className="group relative border-2 border-dashed border-white/5 rounded-[28px] flex flex-col items-center justify-center p-8 text-center space-y-4 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300 min-h-[360px]"
        >
           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <TrendingUp size={32} />
           </div>
           <div>
              <p className="text-white font-bold text-base">New Opportunity</p>
              <p className="text-xs text-gray-600 mt-1 max-w-[180px] mx-auto font-medium leading-relaxed">Discover fresh events and maximize your network potential.</p>
           </div>
           <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity mt-4">Browse Marketplace</span>
        </Link>
      </div>
    </div>
  );
}
