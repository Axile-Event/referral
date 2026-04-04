"use client";

import React, { useEffect, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  TrendingUp, 
  Wallet, 
  Users, 
  Calendar, 
  Download,
  Search,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Ticket as TicketIcon
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useReferrableEventDetail, useEventStats } from "@/lib/hooks/useReferralQueries";

export default function ReferralDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const eventId = params.eventId;
  
  const { data: selectedEvent, isLoading: isEventLoading } = useReferrableEventDetail(eventId);
  const { data: stats, isLoading: isStatsLoading } = useEventStats(eventId);

  const tickets = stats?.tickets || [];
  const isLoading = (isEventLoading || isStatsLoading) && (!selectedEvent || !stats);
  
  const formatCurrency = (val) => `₦${(val || 0).toLocaleString()}`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
         <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
         <p className="text-sm font-bold text-white/40 tracking-[0.2em] uppercase">Opening Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-32 pt-4 px-4 sm:px-0">
      
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
         <Button asChild variant="ghost" className="text-white/60 hover:text-white rounded-xl h-11 px-4 border border-white/5 hover:bg-white/[0.03]">
            <Link href="/dashboard/referrals">
               <ArrowLeft size={16} className="mr-2" /> All Campaigns
            </Link>
         </Button>
         <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10 text-white rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">
               <Download size={14} className="mr-2" /> Export JSON
            </Button>
         </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative group overflow-hidden rounded-[32px] border border-white/5 bg-[#12121f] shadow-2xl">
         <div className="absolute top-0 left-0 right-0 h-full overflow-hidden opacity-30">
            {selectedEvent?.image && (
               <img src={selectedEvent.image} className="w-full h-full object-cover blur-2xl scale-125" alt="" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#12121f] via-[#12121f]/80 to-transparent" />
         </div>

         <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 z-10">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-[28px] overflow-hidden border border-white/10 shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-700">
               <img src={selectedEvent?.image || "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?w=800"} className="w-full h-full object-cover" alt={selectedEvent?.name} />
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                     Active Campaign
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none italic uppercase">
                     {selectedEvent?.name}
                  </h1>
               </div>

               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-8">
                  <MetaItem icon={Calendar} label="Event Date" value={selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : "TBA"} />
                  <MetaItem icon={TrendingUp} label="Your Reward" value={selectedEvent?.referral_reward_type === 'percentage' ? `${selectedEvent.referral_reward_percentage}% Share` : formatCurrency(selectedEvent?.referral_reward_amount)} color="text-primary" />
                  <MetaItem icon={Users} label="Referral Name" value={stats?.referral_name || "N/A"} />
               </div>
            </div>
         </div>
      </div>

      {/* Main Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         <SummaryCard 
            title="Referral Revenue" 
            value={formatCurrency(stats?.referral_revenue)} 
            icon={Wallet} 
            color="text-green-500" 
            bg="bg-green-500/10" 
            metric={`${((stats?.referral_revenue || 0) / (selectedEvent?.category_price || 1) * 10).toFixed(1)}% Yield`}
         />
         <SummaryCard 
            title="Conversions" 
            value={stats?.tickets_sold || 0} 
            icon={CheckCircle} 
            color="text-primary" 
            bg="bg-primary/10" 
            metric="Tickets Sold"
         />
         <SummaryCard 
            title="Program ROI" 
            value={selectedEvent?.referral_reward_type === 'percentage' ? 'High' : 'Stable'} 
            icon={TrendingUp} 
            color="text-sky-400" 
            bg="bg-sky-500/10" 
            metric="Referee Rating"
         />
      </div>

      {/* Tickets Breakdown Section */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h2 className="text-2xl font-bold text-white tracking-tight italic uppercase">Referred <span className="text-primary">Transactions</span></h2>
               <p className="text-xs text-white/30 font-medium">Real-time audit of all ticket sales generated via your unique referral code.</p>
            </div>
            <div className="hidden sm:block relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
               <input placeholder="Filter transactions" className="bg-white/[0.03] border border-white/5 h-10 w-64 rounded-xl pl-9 pr-4 text-xs text-white focus:outline-none focus:border-primary/50" />
            </div>
         </div>

         <div className="bg-[#12121f] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-white/[0.02] border-b border-white/5">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Buyer Identity</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ticket Classification</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Transaction Value</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Settlement Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Details</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                     {tickets.length > 0 ? tickets.map((ticket, i) => (
                        <tr key={ticket.id || i} className="group hover:bg-white/[0.01] transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex flex-col">
                                 <span className="text-sm font-bold text-white/90">{ticket.full_name || "Anonymous Buyer"}</span>
                                 <span className="text-[11px] text-white/30 font-medium">{ticket.email || "N/A"}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2.5">
                                 <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/20 text-primary">
                                    <TicketIcon size={14} />
                                 </div>
                                 <span className="text-sm font-bold text-white/80">{ticket.category_name || "General Admission"}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 font-black text-sm text-white/90">
                              {formatCurrency(ticket.category_price)}
                           </td>
                           <td className="px-8 py-6">
                              <StatusBadge status={ticket.status} />
                           </td>
                           <td className="px-8 py-6">
                              <button className="text-white/20 group-hover:text-primary transition-colors p-2 rounded-xl border border-transparent hover:bg-primary/5 hover:border-primary/10">
                                 <ChevronRight size={18} />
                              </button>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan="5" className="px-8 py-20 text-center">
                              <div className="max-w-xs mx-auto space-y-4">
                                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/10 mx-auto">
                                    <Clock size={32} />
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-white font-bold text-lg">No referrals found yet</p>
                                    <p className="text-xs text-white/20 font-medium leading-relaxed">Increase your marketing output to start seeing conversion data for this campaign.</p>
                                 </div>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color, bg, metric }) {
   return (
      <div className="bg-[#12121f] rounded-[28px] border border-white/5 p-8 flex flex-col gap-6 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
         <div className={`absolute top-0 right-0 w-32 h-32 ${bg} rounded-full -mr-16 -mt-16 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
         <div className="flex items-center justify-between">
            <div className={`p-4 rounded-2xl ${bg} ${color}`}>
               <Icon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{metric}</span>
         </div>
         <div className="space-y-1 relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">{title}</p>
            <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
         </div>
      </div>
   );
}

function MetaItem({ icon: Icon, label, value, color = "text-white/40" }) {
   return (
      <div className="flex items-center gap-3">
         <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
            <Icon size={16} />
         </div>
         <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{label}</p>
            <p className={`text-xs font-bold ${color === 'text-primary' ? 'text-primary' : 'text-white/70'}`}>{value}</p>
         </div>
      </div>
   );
}

function StatusBadge({ status }) {
   const isPaid = status?.toLowerCase() === "confirmed" || status?.toLowerCase() === "paid";
   return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.15em] ${
         isPaid 
           ? "bg-green-500/10 border-green-500/20 text-green-500" 
           : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
      }`}>
         <div className={`w-1 h-1 rounded-full ${isPaid ? "bg-green-500" : "bg-yellow-500"} shadow-lg`} />
         {status || "Pending"}
      </div>
   );
}
