import Link from "next/link";
import { Calendar, MapPin, Gift, Share2, Copy, ArrowLeft, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Event Detail Page
 * Comprehensive event view with referral tools.
 */
export default function EventDetailPage({ params }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary animate-pulse">
        <Gift size={40} />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">Event Details</h1>
      <p className="text-gray-400 font-medium tracking-tight">This page is currently under development.</p>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

function SocialShare({ icon: Icon }) {
  return (
    <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50 transition-all">
      <Icon size={20} />
    </button>
  );
}
