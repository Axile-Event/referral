import Link from "next/link";
import { Calendar, MapPin, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Event Card Component
 * High-fidelity card for event listings.
 */
export function EventCard({ eventId, name, date, reward, image }) {
  return (
    <div className="bg-[#12121f] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/30 transition-all group flex flex-col shadow-xl">
      {/* Image Container */}
      <div className="h-56 relative overflow-hidden">
        <img 
          src={image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-[#0a0a14]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
           <Gift size={14} className="text-primary" />
           <span className="text-[10px] font-bold text-white uppercase tracking-widest">₦{reward} Per Refer</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            <Calendar size={12} className="text-primary" />
            {date}
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <Link href={`/event/${eventId}`} className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            Details
          </Link>
          <Button size="sm" className="rounded-xl px-6 group/btn">
            Refer <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
