"use client";

import Link from "next/link";
import { 
  Calendar, 
  QrCode, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Gift, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Navbar } from "@/components/layout/navbar.jsx";
import { Footer } from "@/components/layout/footer.jsx";

/**
 * Landing Page
 * Matches Axile main site Hero and Features (Image 1, 2).
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Zap size={14} className="text-primary fill-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Nigeria's #1 Event Ticketing Platform</span>
            </div>

            <h1 className="text-5xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] animate-fade-in [animation-delay:200ms]">
              Experience Events <br />
              <span className="text-primary">Like Never Before</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-fade-in [animation-delay:400ms]">
              The all-in-one platform connecting <span className="text-white font-bold">attendees</span> to unforgettable events and empowering <span className="text-white font-bold">organizers</span> to sell out shows.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:600ms]">
              <Button size="lg" className="h-14 px-10 rounded-2xl text-base font-bold">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl text-base font-bold border-white/10 bg-white/5 hover:bg-white/10">
                Find Events
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section (Image 1 Style) */}
        <section className="py-24 bg-[#0a0a14]">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight">Everything you need to succeed</h2>
              <p className="text-gray-400 text-lg">
                Whether you're discovering your next favorite event or selling out your biggest show yet, Axile has you covered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Calendar} 
                title="Smart Discovery" 
                description="AI-powered recommendations help you find events that match your interests. Never miss what matters."
              />
              <FeatureCard 
                icon={QrCode} 
                title="Digital Tickets" 
                description="Instant QR code tickets delivered to your phone. No printing, no hassle, just scan and enter."
              />
              <FeatureCard 
                icon={ShieldCheck} 
                title="Secure Checkout" 
                description="Bank-grade encryption and Paystack integration ensure your payments are always safe and instant."
              />
            </div>
          </div>
        </section>

        {/* Referral System Section */}
        <section className="py-24 bg-white/5 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Gift size={32} />
                </div>
                <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  Share the love, <br />
                  <span className="text-primary">Earn the rewards.</span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Join our affiliate program and earn a commission for every attendee you refer to our premium events. It's simple, automated, and rewarding.
                </p>
                <div className="space-y-4">
                  <BenefitItem text="Up to 15% commission on ticket sales" />
                  <BenefitItem text="Real-time dashboard for tracking earnings" />
                  <BenefitItem text="Weekly payouts directly to your bank" />
                </div>
                <Button size="lg" className="rounded-2xl px-10">Start Earning Now</Button>
              </div>
              <div className="lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all" />
                <div className="relative bg-[#12121f] border border-white/10 rounded-[2.5rem] p-12 overflow-hidden shadow-2xl">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/10" />
                            <div className="space-y-1">
                               <div className="w-24 h-3 bg-white/20 rounded-full" />
                               <div className="w-16 h-2 bg-white/10 rounded-full" />
                            </div>
                         </div>
                         <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">ACTIVE</div>
                      </div>
                      <div className="h-40 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                         <TrendingUpPreview />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="h-20 bg-white/5 rounded-2xl p-4 space-y-2">
                           <div className="w-8 h-2 bg-white/20 rounded-full" />
                           <div className="w-12 h-4 bg-white/40 rounded-full" />
                         </div>
                         <div className="h-20 bg-white/5 rounded-2xl p-4 space-y-2">
                           <div className="w-8 h-2 bg-white/20 rounded-full" />
                           <div className="w-12 h-4 bg-primary/60 rounded-full" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-[#12121f] border border-white/5 p-12 rounded-[2.5rem] text-center space-y-8 hover:border-primary/20 hover:bg-white/[0.02] transition-all group">
      <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-all transform group-hover:rotate-6">
        <Icon size={36} className="stroke-[1.5]" />
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

function BenefitItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <ArrowRight size={14} />
      </div>
      <span className="text-sm font-semibold text-gray-300">{text}</span>
    </div>
  );
}

function TrendingUpPreview() {
  return (
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" className="text-primary">
      <path d="M0 35C20 35 30 5 60 20C90 35 100 0 120 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="120" cy="10" r="4" fill="currentColor" />
    </svg>
  );
}
