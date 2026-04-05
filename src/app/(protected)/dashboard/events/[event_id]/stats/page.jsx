"use client";

import { use, useEffect, useState } from "react";
import { useEventStats } from "@/lib/hooks/useReferralQueries";
import { TicketsTable } from "@/components/referral/tickets-table.jsx";
import { AlertCircle, BarChart3, TrendingUp, Ticket, Copy, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { generateReferralLink } from "@/lib/utils/referral";
import { toast } from "react-hot-toast";

export default function EventStatsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const eventId = params.event_id;
  const user = useAuthStore((s) => s.user);
  
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useEventStats(eventId);

  const [copied, setCopied] = useState(false);
  const username = user?.username || "";
  const referralLink = generateReferralLink({ 
    username, 
    event_id: eventId 
  });

  const handleCopy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 w-full max-w-7xl mx-auto space-y-8">
        <div className="w-full h-8 bg-white/5 animate-pulse rounded-md max-w-xs" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="w-full h-32 bg-white/5 animate-pulse rounded-2xl" />
          <div className="w-full h-32 bg-white/5 animate-pulse rounded-2xl" />
          <div className="w-full h-32 bg-white/5 animate-pulse rounded-2xl" />
        </div>
        <div className="w-full h-64 bg-white/5 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 w-full h-[60vh] flex flex-col justify-center items-center text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Stats Unavailable</h2>
          <p className="text-gray-400 max-w-md">{error?.message || "Could not fetch stats for this event. Please try again."}</p>
        </div>
        <div className="flex gap-4 mt-4">
          <Button onClick={() => refetch()} variant="outline" className="border-white/10 hover:bg-white/5 rounded-full px-8">
            Retry
          </Button>
          <Link href="/dashboard/events">
            <Button className="rounded-full px-8">Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle display formatting
  const displayRevenue = stats?.referral_revenue != null 
    ? `₦${Number(stats.referral_revenue).toLocaleString()}` 
    : "₦0";
    
  const displayTicketsSold = (stats?.tickets_sold ?? stats?.total_conversions) || 0;

  const displayReferralName = stats?.referral_name || "Campaign Stats";
  const tickets = Array.isArray(stats?.tickets) ? stats.tickets : [];

  return (
    <div className="p-6 md:p-10 w-full max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="space-y-6">
        <Link href="/dashboard/referrals" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
               <BarChart3 className="w-5 h-5 text-primary" />
               <span className="text-sm font-bold text-primary tracking-widest uppercase">{stats?.event_name || "Campaign Stats"}</span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {displayReferralName}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
              <div className={`w-2 h-2 rounded-full ${isFetching ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`} />
              {isFetching ? "Syncing data..." : "Live reporting (polls every 15s)"}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0a0a14] to-[#12121a] border border-white/10 rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Ticket className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10 space-y-4">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Tickets Sold</span>
            <div className="text-6xl font-black text-white">{displayTicketsSold}</div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary/10 to-[#12121a] border border-primary/20 rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <TrendingUp className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Total Revenue Generated</span>
            <div className="text-5xl sm:text-6xl font-black text-white tracking-tight">{displayRevenue}</div>
          </div>
        </motion.div>
      </div>

      {/* Tickets Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Recent Sales</h2>
        </div>

        {displayTicketsSold === 0 ? (
          <div className="w-full flex flex-col justify-center items-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5 text-center space-y-6 px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Ticket className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">No tickets sold yet</h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                Your referral link hasn't generated any sales for this event yet. Share it now to start earning!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Button 
                onClick={handleCopy}
                className="flex-1 bg-white text-black hover:bg-gray-200 h-12 rounded-xl font-bold"
              >
                {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                Copy Link
              </Button>
              <Button 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Get your tickets for ${displayReferralName} here: ${referralLink}`)}`, '_blank')}
                className="flex-1 bg-[#25D366] hover:bg-[#20b858] text-white h-12 rounded-xl font-bold"
              >
                <Share2 className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <TicketsTable tickets={tickets} />
        )}
      </motion.div>
    </div>
  );
}
