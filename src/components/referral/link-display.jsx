import React, { useState } from "react";
import { Copy, Check, Share2, MessageCircle, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

/**
 * LinkDisplay
 * 
 * Per-event referral link sharing component.
 * Features: Copy, WhatsApp Share, X Share.
 * Only renders for events where use_referral is true.
 */
export function LinkDisplay({ event, referralLink }) {
  const [copied, setCopied] = useState(false);

  if (!event || !event.use_referral) {
    return (
      <div className="bg-[#12121f] border border-white/5 p-8 rounded-2xl text-center">
        <p className="text-sm text-gray-500 font-medium">Referrals are not enabled for this event.</p>
      </div>
    );
  }

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Check out this event: ${event.name} via Axile!`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${referralLink}`)}`;
  const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`;

  return (
    <div className="bg-[#12121f] rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden group">
      <div className="flex flex-col gap-6 relative z-10 w-full">
         <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-white/40 uppercase tracking-widest">Shareable Program Link</p>
            <div className="px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
               <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Verified</span>
            </div>
         </div>

         <div className="bg-[#05050A] border border-white/5 rounded-[20px] p-4 flex items-center relative overflow-hidden h-14">
            <p className="text-[13px] text-white/70 truncate flex-1 font-mono tracking-tight leading-none overflow-hidden pr-4">
               {referralLink || "Generating link..."}
            </p>
            <button 
              onClick={handleCopy}
              className="text-primary hover:text-primary/80 transition-colors p-2 shrink-0 bg-primary/10 rounded-lg hover:bg-primary/20"
            >
               {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <Button 
               asChild
               className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold h-12 rounded-[16px] text-[13px] transition-all active:scale-[0.98]"
            >
               <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
               </a>
            </Button>
            <Button 
               asChild
               className="bg-white hover:bg-white/90 text-black font-semibold h-12 rounded-[16px] text-[13px] transition-all active:scale-[0.98]"
            >
               <a href={xUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <Twitter size={18} />
                  <span>Share on X</span>
               </a>
            </Button>
         </div>
      </div>
      
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none" />
    </div>
  );
}
