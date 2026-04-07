"use client";

import React, { useState, useRef, useEffect } from "react";
import { useReferrableEvents } from "@/lib/hooks/useReferralQueries";
import { EventCard } from "@/components/event/event-card";
import { Loader2, Search, Compass, ChevronDown, Zap } from "lucide-react";

const CATEGORIES = ["All", "Tech", "Business", "Music", "Education", "Fashion"];

export default function ReferralEventsPage() {
  const { data, isLoading } = useReferrableEvents();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Handle the new API response structure { events: [], count: number }
  const displayEvents = data?.events || [];
  
  const filteredEvents = displayEvents.filter(e => {
    // Only show if referral is enabled
    if (!e.use_referral) return false;
    
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                         (e.location?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || e.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16 pb-32 w-full animate-fade-in font-sans relative px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Visual Background Accent */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-30" />

      {/* Discovery Header Section */}
      <div className="flex flex-col gap-6 pt-4 relative z-10">
        <div className="max-w-2xl space-y-6">


           <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white/95 leading-[1.1]">
              Discover Premium <br /> Referral Programs
           </h1>
           <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-lg font-medium">
              Find verified events, share your unique link, and earn <span className="text-white/80">unlimited commissions</span> on every successful ticket sale.
           </p>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch lg:items-center mt-6 w-full relative z-[100]">
           
           <div className="relative w-full lg:w-[450px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                 type="text" 
                 placeholder="Search events, organizers or locations..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full h-14 bg-white/[0.03] backdrop-blur-md border border-white/5 hover:border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20 shadow-xl"
              />
           </div>

           <CustomDropdown 
              options={CATEGORIES}
              value={activeCategory}
              onChange={setActiveCategory}
           />

        </div>
      </div>

      <div className="flex items-center gap-4 relative z-10">
         <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(227,54,41,0.8)] animate-pulse" />
            <span className="text-[13px] font-extrabold text-white/30 tracking-widest uppercase">{filteredEvents.length} Active Opportunities</span>
         </div>
         <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Program Grid */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
             <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
             <p className="text-[11px] font-bold text-white/20 tracking-[0.3em] uppercase">Syncing Marketplace...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredEvents.map(event => {
              const rewardDisplay = event.referral_reward_type === "percentage"
                ? `${event.referral_reward_percentage}% Reward`
                : `₦${(event.referral_reward_amount || 0).toLocaleString()} Reward`;

              return (
                <EventCard 
                   key={event.event_id}
                   eventId={event.event_id}
                   eventSlug={event.event_slug}
                   name={event.name}
                   location={event.location}
                   reward={rewardDisplay}
                   date={event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBA"}
                   image={event.image || "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?w=800"}
                />
              );
            })}
          </div>
        )}

        {/* Empty Result State */}
        {!isLoading && filteredEvents.length === 0 && (
           <div className="flex flex-col items-center justify-center text-center py-32 bg-white/[0.01] rounded-[40px] border border-white/5 shadow-2xl">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8">
                <Compass size={36} className="text-white/10 stroke-[1]" />
              </div>
              <h3 className="text-xl font-bold text-white/90 mb-2">No matching programs</h3>
              <p className="text-white/40 text-[15px] max-w-sm font-medium leading-relaxed">We couldn't find any referral-enabled events matching your current search or category filters.</p>
           </div>
        )}
      </div>

    </div>
  );
}

function CustomDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full lg:w-[220px] group" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 w-full h-14 bg-[#12121f] border border-white/5 hover:border-white/10 rounded-2xl px-6 flex items-center justify-between text-sm font-bold text-white/90 shadow-xl transition-all active:scale-[0.98]"
        type="button"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={14} className={`text-white/30 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-[#0C0C14]/95 backdrop-blur-3xl border border-white/10 rounded-[24px] overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] z-[9999] animate-fade-in origin-top p-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-[13px] font-bold transition-all rounded-[14px] ${
                opt === value 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}