"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Calendar, MapPin, Share2, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useAuthStore } from "@/store/authStore";
import { generateReferralLink } from "@/lib/utils/referral";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export function EventCard({ event }) {
  const [copied, setCopied] = useState(false);
  const username = useAuthStore((s) => s.username);
  
  // The link generated to share
  const referralLink = generateReferralLink({ 
    username, 
    event_slug: event.event_slug, 
    event_id: event.event_id || event.id 
  });

  const handleCopy = async () => {
    if (!username) {
      toast.error("Please set your username in settings first!", {
        duration: 4000,
        style: { background: "#161622", color: "#fff", border: "1px solid rgba(227, 54, 41, 0.2)" }
      });
      return;
    }
    if (!referralLink) {
      toast.error("Could not generate referral link");
      return;
    }
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    if (!username) {
      toast.error("Please set your username in settings first!");
      return;
    }
    const text = `Check out ${event.name}! Get your tickets here: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnTwitter = () => {
    if (!username) {
      toast.error("Please set your username in settings first!");
      return;
    }
    const text = `Check out ${event.name}! Get your tickets here: ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Determine reward text
  let rewardText = "";
  if (event.referral_reward_type === "percentage") {
    rewardText = `${event.referral_reward_percentage}% per ticket`;
  } else if (event.referral_reward_type === "flat") {
    rewardText = `₦${event.referral_reward_amount} per ticket`;
  }

  // Fallback for image
  const defaultImage = "https://images.unsplash.com/photo-1540039155732-d68872ae6f00?auto=format&fit=crop&q=80&w=600";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a14] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col group relative"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-white/5">
        <img 
          src={event.image || defaultImage} 
          alt={event.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/45" />
        
        {/* Reward Badge */}
        {rewardText && (
          <div className="absolute top-4 right-4 bg-primary text-black px-3 py-1 text-xs font-semibold rounded-full shadow-md">
            Earn {rewardText}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col space-y-5">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white line-clamp-1 group-hover:text-primary transition-colors" title={event.name}>
            {event.name}
          </h3>
          <div className="flex flex-col space-y-1.5 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="truncate">{event.date ? new Date(event.date).toLocaleDateString() : "TBA"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="truncate">{event.location || "TBA"}</span>
            </div>
          </div>
        </div>

        {/* Link Generation Box */}
        {event.use_referral ? (
          <div className="space-y-3 mt-auto">
            <label className="text-xs font-medium text-gray-500">Your referral link</label>
            <div className="flex bg-[#12121a] rounded-xl border border-white/10 p-1 relative items-center group/input">
              <input
                type="text"
                readOnly
                value={referralLink || "Generate your link..."}
                className="bg-transparent text-sm text-gray-300 w-full px-3 py-2 outline-none font-mono"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                disabled={!referralLink}
                className="shrink-0 h-8 px-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                title="Copy link"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex gap-2 w-full pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={shareOnWhatsApp}
                disabled={!referralLink}
                className="flex-1 bg-transparent border-white/10 hover:border-[#25D366] hover:text-[#25D366] h-9 text-xs font-medium"
              >
                <Share2 className="w-3 h-3 mr-2" /> WhatsApp
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={shareOnTwitter}
                disabled={!referralLink}
                className="flex-1 bg-transparent border-white/10 hover:border-[#1DA1F2] hover:text-[#1DA1F2] h-9 text-xs font-medium"
              >
                <Share2 className="w-3 h-3 mr-2" /> X (Twitter)
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-auto p-4 bg-white/5 border border-white/5 rounded-xl text-center">
            <span className="text-sm text-gray-400 font-medium">
              Referral not available
            </span>
          </div>
        )}
        
        {/* Actions */}
        <div className="pt-2 border-t border-white/10">
          <Link href={`/dashboard/events/${event.event_id || event.id}/stats`} className="w-full">
            <Button className="w-full bg-white/5 hover:bg-white/10 text-white border-none transition-colors h-10">
              <BarChart2 className="w-4 h-4 mr-2 text-primary" />
              View Stats
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
