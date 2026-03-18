import Link from "next/link";
import { Calendar, MapPin, Gift, ArrowRight, UserCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Referral Landing Page
 * Shown when a user clicks a referral link.
 * Matches Axile branding (Image 2 style).
 */
export default function ReferralLandingPage({ params }) {
  // Data would be fetched based on code/id
  const event = null; // Placeholder state

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-2xl w-full space-y-12 relative z-10 text-center animate-fade-in">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">Axile</span>
        </div>

        {/* Invitation */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary uppercase tracking-widest">
            <UserCheck size={14} />
            You've been invited {event?.referrer ? `by ${event.referrer}` : ""}
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.85]">
            Experience <br />
            <span className="text-primary">{event?.name || "Event Name"}</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
            {event?.description || "Join Africa's most brilliant minds for a night of innovation and networking."}
          </p>
        </div>

        {/* Event Ticket Preview */}
        <div className="bg-[#12121f] border border-white/5 rounded-[2.5rem] p-8 lg:p-12 space-y-8 shadow-2xl relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <Sparkles size={120} className="text-primary" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</p>
              <p className="text-lg font-bold text-white tracking-tight">{event?.date || "--- --, ----"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</p>
              <p className="text-lg font-bold text-white tracking-tight">{event?.location || "Location TBD"}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
             <Button size="lg" className="h-16 rounded-[1.25rem] text-lg font-black tracking-tight group">
               Claim Your Ticket <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
             </Button>
             <p className="text-sm text-gray-500 font-medium">
               New to Axile? <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
             </p>
          </div>
        </div>

        <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.3em]">
          Nigeria's #1 Event Ticketing Platform
        </p>
      </div>
    </div>
  );
}
