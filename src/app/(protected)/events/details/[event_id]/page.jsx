"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useReferral } from "@/lib/hooks/useReferral";
import { generateReferralLink } from "@/lib/utils/referral";
import { 
  ArrowLeft, Copy, Check, ArrowUpRight, Share2, Zap, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function EventReferralDetailPage() {
  const params = useParams();
  const identifier = params.event_id; 
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Debug user details for referral handle identification
  React.useEffect(() => {
    if (user) console.log("Current Authenticated User (Event Details):", user);
  }, [user]);
  const { selectedEvent: event, isLoading, fetchReferrableEventDetail } = useReferral();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!identifier) return;
    fetchReferrableEventDetail(identifier);
  }, [identifier, fetchReferrableEventDetail]);

  // Priority for user identification (Referral ID):
  // We check multiple keys and nested structures (profile, user, data) to handle wrapped API responses.
  const userHandle = 
    user?.profile?.referree_id ||
    user?.profile?.referee_id ||
    user?.profile?.username ||
    user?.profile?.Username ||
    user?.referree_id || 
    user?.referee_id || 
    user?.username || 
    user?.Username || 
    user?.user?.username ||
    user?.user?.Username ||
    user?.user?.referree_id ||
    user?.user?.referee_id ||
    user?.data?.username ||
    user?.data?.Username ||
    user?.data?.referree_id ||
    user?.data?.referee_id ||
    user?.handle ||
    (user?.profile?.firstname && user?.profile?.lastname ? `${user.profile.firstname}-${user.profile.lastname}`.toLowerCase() : null) ||
    (user?.first_name && user?.last_name ? `${user.first_name}-${user.last_name}`.toLowerCase() : null) ||
    (user?.user?.first_name && user?.user?.last_name ? `${user.user.first_name}-${user.user.last_name}`.toLowerCase() : null) ||
    user?.profile?.firstname?.toLowerCase() ||
    user?.first_name?.toLowerCase() ||
    user?.user?.first_name?.toLowerCase() ||
    user?.profile?.id ||
    user?.id ||
    user?.pk ||
    user?.user?.id ||
    "referee";
  
  // Build link using the global utility to ensure consistency
  // Uses event_slug primarily, or event_id (without 'event:' prefix)
  const referralLink = event
    ? generateReferralLink({
        referee_id: userHandle,
        event_slug: event.event_slug,
        event_id: event.event_id,
      })
    : "";

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-primary" />
        <span className="text-white/30 text-[13px] font-medium tracking-wide">Loading program insights...</span>
      </div>
    );
  }

  if (!event && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 relative pt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <h2 className="text-2xl font-medium text-white tracking-tight relative z-10 text-center px-4">Program Not Found</h2>
        <p className="text-white/40 text-[15px] relative z-10 text-center px-4">This program may have reached its limit or the link is invalid.</p>
        <Button onClick={() => router.push("/events/referral-enabled")} variant="ghost" className="mt-4 text-white hover:bg-white/5 relative z-10">
           Browse All Programs
        </Button>
      </div>
    );
  }

  const rewardText = event.referral_reward_type === 'percentage' 
    ? `${event.referral_reward_percentage}%`
    : `₦${event.referral_reward_amount?.toLocaleString()}`;

  const eventDate = event.date ? new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  }) : "Date TBA";

  return (
    <div className="max-w-7xl mx-auto pb-32 font-sans relative overflow-x-hidden pt-12">
      
      {/* Dynamic Navigation */}
      <div className="mb-10 lg:mb-16 relative z-10">
         <button 
           onClick={() => router.back()}
           className="inline-flex items-center gap-2 text-[14px] font-medium text-white/40 hover:text-white transition-colors group"
         >
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
           Back to Marketplace
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24 items-start relative z-10 px-4">
        
        <div className="flex flex-col space-y-12">
           <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 shadow-[0_0_20px_rgba(227,54,41,0.15)]">
                 <Zap size={14} className="text-primary fill-current drop-shadow-md" />
                 <span className="text-[11px] font-bold text-primary tracking-widest uppercase">Verified Program</span>
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
           
           <div className="w-full h-64 sm:h-[400px] lg:h-[500px] rounded-[32px] overflow-hidden bg-[#05050A] border border-white/5 relative group shadow-2xl">
                <img 
                  src={event.image || "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80"} 
                  alt={event.name} 
                  className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.02]"
                />
           </div>

           <div className="max-w-3xl space-y-10 pt-4">
               <div className="flex items-center gap-4 p-4 rounded-[24px] border border-white/5 bg-white/[0.02]">
                   <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap className="text-primary w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[12px] font-semibold text-white/40 uppercase tracking-widest mb-0.5">Program Managed By</p>
                      <p className="text-[15px] font-medium text-white/90">Axile Network</p>
                   </div>
               </div>

               <div className="h-px w-full bg-white/[0.04]" />
               
               <div className="space-y-4">
                  <h3 className="text-[20px] font-medium text-white/90 tracking-tight flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(227,54,41,0.6)]" />
                      About The Program
                  </h3>
                  <div className="prose prose-invert max-w-none text-white/50 leading-[1.8]">
                     <p>{event.description || "No specific details provided. Join the program to start sharing."}</p>
                     
                     <div className="mt-8 space-y-4 bg-white/[0.03] p-6 rounded-[24px] border border-white/5">
                        <h4 className="text-white text-[15px] font-semibold tracking-wide">Key Benefits & Details:</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">
                           <li className="flex items-start gap-3 text-[14px]">
                              <Check size={18} className="text-primary shrink-0" />
                              <span>Automatic referral tracking</span>
                           </li>
                           <li className="flex items-start gap-3 text-[14px]">
                              <Check size={18} className="text-primary shrink-0" />
                              <span>Max {event.max_quantity_per_booking || 10} tickets per booking</span>
                           </li>
                           <li className="flex items-start gap-3 text-[14px]">
                              <Check size={18} className="text-primary shrink-0" />
                              <span>Dynamic reward payouts</span>
                           </li>
                           <li className="flex items-start gap-3 text-[14px]">
                              <Check size={18} className="text-primary shrink-0" />
                              <span>Unified referee dashboard</span>
                           </li>
                        </ul>

                        {event.ticket_categories?.length > 0 && (
                          <div className="pt-4 mt-4 border-t border-white/5">
                             <p className="text-[12px] font-semibold text-white/40 uppercase tracking-widest mb-3">Available Categories</p>
                             <div className="flex flex-wrap gap-2">
                                {event.ticket_categories.map((cat, i) => (
                                   <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[12px] text-white/70">
                                      {cat.name || cat}
                                   </span>
                                ))}
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
           </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:sticky lg:top-12">
            <div className="flex flex-col gap-8 bg-[#0C0C14]/80 backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
                 <div className="space-y-1 relative z-10 w-full">
                    <div className="inline-flex items-center gap-2 mb-3">
                       <Share2 className="text-white/40" size={16} />
                       <span className="text-[12px] font-bold text-white/50 tracking-widest uppercase">Target Reward</span>
                    </div>
                    <div className="pb-1">
                        <span className="text-[64px] font-light tracking-tighter leading-none text-primary drop-shadow-sm">
                           {rewardText}
                        </span>
                    </div>
                    <p className="text-[14px] text-white/40 pt-2 font-medium leading-relaxed">
                       {event.referral_reward_type === 'percentage' 
                         ? "Earn this percentage on every ticket price sold through your link."
                         : "Fixed commission for every successful conversion made."}
                    </p>
                 </div>

                 <div className="h-px w-full bg-white/[0.04] relative z-10" />

                 <div className="space-y-4 relative z-10">
                    <label className="text-[12px] font-semibold text-white/30 uppercase tracking-widest">Shareable Referral Link</label>
                    
                    <div className="bg-[#05050A] border border-white/5 rounded-[20px] p-4 flex items-center relative overflow-hidden">
                       <p className="text-[13px] text-white/70 truncate flex-1 font-mono tracking-tight leading-none overflow-hidden">
                          {referralLink}
                       </p>
                    </div>
                    
                    <Button 
                       onClick={handleCopy}
                       className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-7 h-14 rounded-[20px] text-[15px] transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(227,54,41,0.2)]"
                    >
                       {copied ? "Link Copied" : "Copy Link"}
                       {copied ? <Check size={18} /> : <ArrowUpRight size={18} className="text-white/70" />}
                    </Button>
                 </div>

                 <div className="p-4 bg-yellow-500/5 rounded-[20px] border border-yellow-500/10 relative z-10">
                    <p className="text-[11px] text-yellow-500/80 leading-relaxed font-medium">
                       Links are uniquely tied to your identity. Do not modify the link to ensure commission tracking.
                    </p>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
}

