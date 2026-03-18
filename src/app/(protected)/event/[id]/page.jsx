import Link from "next/link";
import { Calendar, MapPin, Gift, Share2, Copy, ArrowLeft, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Event Detail Page
 * Comprehensive event view with referral tools.
 */
export default function EventDetailPage({ params }) {
  // Demo data
  const event = {
    id: "1",
    name: "Axile Creative Hangout 2026",
    description: "Join the biggest creative gathering in Lagos. A night of networking, music, and innovation for Africa's most brilliant minds.",
    date: "April 12, 2026",
    time: "6:00 PM",
    location: "Eko Convention Center, Lagos",
    reward: 2500,
    image: "https://images.unsplash.com/photo-1540575861501-7ce0e22042f9?q=80&w=2070&auto=format&fit=crop"
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Navigation */}
      <Link href="/events/referral-enabled" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* Banner */}
          <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img 
              src={event.image} 
              className="w-full h-full object-cover" 
              alt={event.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent" />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
              {event.name}
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed font-medium">
              {event.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <InfoItem icon={Calendar} label="Date & Time" value={`${event.date} • ${event.time}`} />
              <InfoItem icon={MapPin} label="Location" value={event.location} />
            </div>
          </div>
        </div>

        {/* Right Column: Referral Box */}
        <div className="space-y-6">
          <div className="bg-[#12121f] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 space-y-8 sticky top-24 shadow-2xl shadow-primary/5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Gift size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Refer & Earn</h3>
              <p className="text-gray-400 text-sm font-medium">
                Refer someone to this event and earn <span className="text-primary font-bold">₦{event.reward}</span> immediately upon their successful ticket purchase.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Your Referral Link</label>
                <div className="flex gap-2">
                  <Input readOnly value={`referral.axile.ng/ref/XYZ123/event/${event.id}`} className="bg-white/5 rounded-xl border-white/10 text-xs py-3" />
                  <Button size="icon" className="rounded-xl w-12 h-12 shrink-0">
                    <Copy size={18} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <SocialShare icon={Twitter} />
                <SocialShare icon={Send} />
                <SocialShare icon={Share2} />
              </div>

              <Button className="w-full h-14 rounded-2xl font-black text-base">
                Promote This Event
              </Button>
            </div>

            <p className="text-[10px] text-center text-gray-600 font-bold uppercase tracking-widest">
              Terms & Conditions apply
            </p>
          </div>
        </div>
      </div>
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
