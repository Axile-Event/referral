"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { 
  ArrowLeft, Copy, Check, ArrowUpRight, Share2, Zap, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function EventReferralDetailPage() {
  const params = useParams();
  const slug = params.event_id; 
  const router = useRouter();
  const { user } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://youdoc.onrender.com"}/referee/events/${slug}`
        );
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setEvent(data.event || data);
      } catch (error) {
        console.error("Failed to load event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);


  const userHandle =
    user?.slug ||
    user?.name?.toLowerCase().replace(/\s+/g, "-") ||
    "referee";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://axile.ng";
  const referralLink = event
    ? `${baseUrl}/${userHandle}/${event.event_slug || slug}/${event.event_id}`
    : "";

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-primary" />
        <span className="text-white/30 text-[13px] font-medium tracking-wide">Loading program details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <h2 className="text-2xl font-medium text-white tracking-tight relative z-10">Event Not Found</h2>
        <p className="text-white/40 text-[15px] relative z-10">The program link may be invalid or has expired.</p>
        <Button onClick={() => router.push("/events/referral-enabled")} variant="ghost" className="mt-4 text-white hover:bg-white/5 relative z-10">
           Return Home
        </Button>
      </div>
    );
  }

  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto pb-32 font-sans relative overflow-x-hidden pt-12">
      
      {/* 2024 Navbar */}
      <div className="mb-10 lg:mb-16 relative z-10">
         <button 
           onClick={() => router.back()}
           className="inline-flex items-center gap-2 text-[14px] font-medium text-white/40 hover:text-white transition-colors group"
         >
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
           Back to Programs
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24 items-start relative z-10">
        
        {/* Left Column: Flowing Content */}
        <div className="flex flex-col space-y-12">
           
           {/* Minimalist Header with tiny red flair */}
           <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 shadow-[0_0_20px_rgba(227,54,41,0.15)]">
                 <Zap size={14} className="text-primary fill-current drop-shadow-md" />
                 <span className="text-[11px] font-bold text-primary tracking-widest uppercase">High Conversion</span>
              </div>
           
              <h1 className="text-[36px] sm:text-[48px] lg:text-[60px] font-medium tracking-tight text-white/95 leading-[1.05]">
                 {event.name}
              </h1>
              
              <div className="flex items-center gap-4 text-[13px] sm:text-[15px] font-medium pt-2">
                 <span className="text-white/80">{eventDate}</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(227,54,41,0.6)]" />
                 <span className="text-white/60">{event.location}</span>
              </div>
           </div>
           
           {/* Deep atmospheric image */}
           <div className="w-full h-64 sm:h-[400px] lg:h-[500px] rounded-[32px] overflow-hidden bg-[#05050A] border border-white/5 relative group shadow-2xl shadow-black/40">
                <img 
                  src={event.image} 
                  alt={event.name} 
                  className="w-full h-full object-cover grayscale-[0.4] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.02] mix-blend-luminosity hover:mix-blend-normal"
                />
           </div>

           <div className="max-w-3xl space-y-10 pt-4">

               {/* Organizer Block */}
               <div className="flex items-center gap-4 p-4 rounded-[24px] border border-white/5 bg-white/[0.02]">
                   <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center p-2.5 overflow-hidden">
                      <img src="/axile-logo-main-cropped.png" alt="Axile" className="w-full h-full object-contain mix-blend-screen" />
                   </div>
                   <div>
                      <p className="text-[12px] font-semibold text-white/40 uppercase tracking-widest mb-0.5">Presented By</p>
                      <p className="text-[15px] font-medium text-white/90">Axile Network Partners</p>
                   </div>
                   <div className="ml-auto px-4 py-2 text-[12px] font-medium text-white/50 bg-white/5 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                      View Profile
                   </div>
               </div>

               <div className="h-px w-full bg-white/[0.04]" />
               
               {/* Main Description */}
               <div className="space-y-4">
                  <h3 className="text-[20px] font-medium text-white/90 tracking-tight flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(227,54,41,0.6)]" />
                      About The Program
                  </h3>
                  <div className="prose prose-invert prose-p:text-white/50 prose-p:leading-[1.9] prose-p:text-[15px] sm:prose-p:text-[16px] max-w-none">
                     <p>{event.description}</p>
                     
                     <p className="mt-6 font-medium text-white/70">Why join us?</p>
                     <ul className="mt-2 space-y-2 text-white/50 text-[15px] sm:text-[16px] list-none p-0">
                        <li className="flex items-start gap-2">
                           <Check size={16} className="text-primary shrink-0 mt-1" /> Network with elite industry professionals
                        </li>
                        <li className="flex items-start gap-2">
                           <Check size={16} className="text-primary shrink-0 mt-1" /> Access exclusive resources and VIP areas
                        </li>
                        <li className="flex items-start gap-2">
                           <Check size={16} className="text-primary shrink-0 mt-1" /> Earn substantial rewards through automatic affiliate payouts
                        </li>
                     </ul>
                  </div>
               </div>
           </div>
        </div>

        {/* Right Column: 2024 Smooth Toolkit Widget Subtly Styled */}
        <div className="lg:sticky lg:top-12">
            <div className="flex flex-col gap-8 bg-[#0C0C14]/80 backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-white/10">

                 <div className="space-y-1 relative z-10 w-full">
                    <div className="inline-flex items-center gap-2 mb-3">
                       <Share2 className="text-white/40" size={16} />
                       <span className="text-[12px] font-bold text-white/50 tracking-widest uppercase">Commission Rate</span>
                    </div>
                    {/* Minimal White Text */}
                    <div className="pb-1">
                        <span className="text-[64px] font-light tracking-tighter leading-none text-white drop-shadow-sm">
                           {event.referral_reward_percentage}%
                        </span>
                    </div>
                    <p className="text-[14px] text-white/40 pt-2 font-medium leading-relaxed">
                       Earn this percentage directly in your wallet on every uniquely converted ticket sale.
                    </p>
                 </div>

                 <div className="h-px w-full bg-white/[0.04] relative z-10" />

                 <div className="space-y-4 relative z-10">
                    <label className="text-[12px] font-semibold text-white/30 uppercase tracking-widest">Your Private Link</label>
                    
                    {/* Focus Link container */}
                    <div className="bg-[#05050A] border border-white/5 hover:border-primary/30 transition-colors rounded-[20px] p-4 flex items-center relative overflow-hidden group/link">
                       <p className="text-[14px] text-white/70 truncate flex-1 font-mono tracking-tight group-hover/link:text-white transition-colors">
                          {referralLink}
                       </p>
                       <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#05050A] to-transparent pointer-events-none" />
                    </div>
                    
                    <Button 
                       onClick={handleCopy}
                       className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-7 h-14 rounded-[20px] text-[15px] transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                    >
                       {copied ? "Link Copied to Clipboard" : "Copy Program Link"}
                       {copied ? <Check size={18} /> : <ArrowUpRight size={18} className="text-white/70" />}
                    </Button>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
}
