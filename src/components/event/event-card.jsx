"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EventCard({ eventId, eventSlug, name, date, reward, image, location }) {
  const routeParam = eventSlug || eventId.replace(/[^a-zA-Z0-9_-]/g, "-");
  const detailPath = `/events/details/${routeParam}`;

  return (
    <Link 
      href={detailPath}
      className="group flex flex-col bg-white/[0.02] rounded-[24px] border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden shadow-2xl shadow-black/20 relative"
    >
      {/* Image Container */}
      <div className="h-56 relative w-full overflow-hidden bg-white/5 border-b border-white/5">
        <img 
          src={image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"} 
          alt={name}
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        />
        
        {/* Subtle modern badge with primary red accent */}
        <div className="absolute top-4 left-4 bg-[#0a0a14]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20">
          <span className="text-[11px] font-bold text-primary tracking-widest uppercase">{reward}</span>
        </div>
      </div>

      {/* Body Container */}
      <div className="p-6 flex flex-col flex-1 relative z-10">
        {/* Meta Info */}
        <div className="flex items-center gap-2 mb-3">
           <span className="text-[13px] text-gray-400 font-medium">{date}</span>
           <span className="w-1 h-1 rounded-full bg-primary/30" />
           {location && (
              <span className="text-[13px] text-gray-400 font-medium truncate">{location}</span>
           )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-medium text-white/90 group-hover:text-white line-clamp-2 leading-snug tracking-tight mb-8 transition-colors">
          {name}
        </h3>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Button - Ghost to Primary red on hover */}
        <div className="flex items-center justify-between mt-auto">
            <span className="text-[13px] font-medium text-gray-500 group-hover:text-white transition-colors duration-300">
               View Program
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 border border-white/10 group-hover:border-primary/0 group-hover:text-white group-hover:bg-primary transition-all duration-300 transform group-hover:-rotate-45">
                <ArrowRight size={14} className="stroke-[2.5]" />
            </div>
        </div>
      </div>
    </Link>
  );
}
