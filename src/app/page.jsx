import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

/**
 * Placeholder Landing Page
 * Features a high-fidelity Hero section for Axile Referral.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white selection:bg-primary/30">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[80vh] bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
      
      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-24 text-center space-y-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary uppercase tracking-widest">
          <Sparkles size={14} className="fill-primary" />
          Join the referral revolution
        </div>
        
        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85]">
          Experience <br />
          <span className="text-primary italic">Axile Referral</span>
        </h1>
        
        <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
          The ultimate platform to discover, share, and earn. <br />
          Experience premium events and get rewarded for every referral that checks in.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link href="/login">
            <Button size="lg" className="h-16 px-10 rounded-[1.25rem] text-lg font-black tracking-tight group">
              Get Started <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-[1.25rem] text-lg font-bold border-white/10 hover:bg-white/5 tracking-tight">
              Create Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
