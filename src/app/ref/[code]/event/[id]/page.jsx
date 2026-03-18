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

        {/* Page Under Development */}
        <div className="bg-[#12121f] border border-white/5 rounded-[2.5rem] p-12 lg:p-20 space-y-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary animate-pulse mb-4">
            <Sparkles size={40} />
          </div>
          <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-white">
            Referral Page
          </h1>
          <p className="text-lg text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
            This referral experience is currently under development. Please check back later.
          </p>
          <div className="pt-8 w-full max-w-xs">
            <Link href="/login">
              <Button size="lg" className="w-full h-14 rounded-2xl font-black text-base">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.3em]">
          Nigeria's #1 Event Ticketing Platform
        </p>
      </div>
    </div>
  );
}
