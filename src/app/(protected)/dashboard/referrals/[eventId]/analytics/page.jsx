"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Copy, 
  Check,
  Zap,
  MousePointer2,
  Users,
  Wallet,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { motion } from "framer-motion";
import { useReferral } from "@/lib/hooks/useReferral";

export default function EventAnalyticsPage() {
  const params = useParams();
  const { referrals, myReferralCode } = useReferral();
  const eventId = params?.eventId;
  const event = referrals.find(r => r.id === eventId) || referrals[0];
  
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://referral.axile.ng/ref/${myReferralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!event) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20 px-4 sm:px-0">
      
      {/* Sleek Navigation */}
      <div className="space-y-8">
        <Link 
          href="/dashboard/referrals" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-all font-black text-[10px] tracking-[0.2em] group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO PORTFOLIO</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-3">
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">{event.name}</h1>
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.1em]">
                 <Zap size={12} className="fill-current" />
                 <span>Campaign Active & Syncing</span>
              </div>
           </div>
           
           <Button className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 font-black text-[10px] uppercase tracking-[0.2em] px-6 transition-all active:scale-95 group/share">
              <Share2 className="mr-2 group-hover:rotate-12 transition-transform" size={14} /> Promote & Share
           </Button>
        </div>
      </div>

      {/* Sexy Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <MetricCard title="Click-Throughs" value={event.clicks} icon={MousePointer2} />
         <MetricCard title="Sales Generated" value={event.conversions} icon={Users} />
         <MetricCard title="Current Earnings" value={event.earned} icon={Wallet} color="text-green-500" />
      </div>

      {/* Glassmorphic Referral Card */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#12121f] border border-white/5 p-8 md:p-14 text-white shadow-2xl">
         {/* Background Glow */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px] opacity-40" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-[80px] opacity-30" />

         <div className="relative z-10 max-w-2xl text-center mx-auto space-y-8">
            <div className="space-y-3">
               <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white/95">Your Referral Engine</h2>
               <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md mx-auto small-caps">Deploy your unique link across your network to capture commissions on every ticket sale.</p>
            </div>

            <div className="group relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[24px] blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
               <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[22px] p-2 pr-2 sm:pr-3">
                  <div className="flex-1 px-5 py-3 text-left">
                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Personal ID</p>
                     <p className="font-mono text-xs sm:text-sm font-bold text-white/90 truncate select-all">referral.axile.ng/ref/{myReferralCode}</p>
                  </div>
                  <Button 
                    onClick={handleCopy}
                    className="bg-primary hover:bg-primary/90 hover:scale-[1.02] text-white h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
                  >
                    {copied ? (
                      <> <Check className="mr-2" size={14} /> Copied </>
                    ) : (
                      <> <Copy className="mr-2" size={14} /> Copy Link </>
                    )}
                  </Button>
               </div>
            </div>

            <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
               <span className="w-8 h-px bg-white/5" />
               Payouts processed after check-in
               <span className="w-8 h-px bg-white/5" />
            </p>
         </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color = "text-white" }) {
  return (
    <div className="bg-[#12121f] border border-white/5 p-8 rounded-[28px] flex flex-col items-center text-center space-y-4 hover:border-primary/10 transition-all duration-300 group">
       <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-primary group-hover:bg-primary/5 transition-all">
          <Icon size={22} />
       </div>
       <div>
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.25em] mb-1.5">{title}</p>
          <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
       </div>
    </div>
  );
}
