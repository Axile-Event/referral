"use client";

import React, { useEffect, useState, useRef } from "react";
import { useReferral } from "@/lib/hooks/useReferral";
import { EventCard } from "@/components/event/event-card";
import { Loader2, Search, Compass, ChevronDown, Zap } from "lucide-react";

const CATEGORIES = ["All", "Tech", "Business", "Music", "Education", "Fashion"];

export default function ReferralEventsPage() {
  const { referrableEvents, isLoading, fetchReferrableEvents } = useReferral();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchReferrableEvents();
  }, [fetchReferrableEvents]);

  // Handle the new API response structure { events: [], count: number }
  const displayEvents = referrableEvents?.events || [];
  
  const filteredEvents = displayEvents.filter(e => {
    const matchesSearch = (e.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
                         (e.location?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16 pb-32 w-full animate-fade-in font-sans relative">
      
      {/* Sexy subtle reddish glow background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50 mix-blend-screen" />
      <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none opacity-50 mix-blend-screen" />

      {/* 2024 Header Section */}
      <div className="flex flex-col gap-6 pt-4 relative z-10">
        <div className="max-w-2xl space-y-4">
           {/* Subtle primary badge */}
           <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 backdrop-blur-md px-3 py-1 rounded-full shadow-[0_0_20px_rgba(227,54,41,0.15)]">
              <Zap size={14} className="text-primary fill-current" />
              <span className="text-[11px] font-bold text-primary tracking-widest uppercase">Earn Commissions</span>
           </div>

           <h1 className="text-[32px] sm:text-[44px] font-medium tracking-tight text-white/95 leading-[1.1]">
              Curated Referral Programs
           </h1>
           <p className="text-white/50 text-[15px] sm:text-base leading-relaxed max-w-lg">
              Find active programs, share your unique link, and automatically earn <span className="text-white/80 font-medium">unlimited commissions</span> on every ticket sale.
           </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch lg:items-center mt-6 w-full relative z-[100]">
           
           {/* Modern Minimal Search */}
           <div className="relative w-full lg:w-[400px] group">
              {/* Subtle hover red border glow effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm pointer-events-none" />
              
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors duration-300" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search events or locations..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-12 bg-white/[0.03] backdrop-blur-md border border-white/5 hover:border-white/10 rounded-2xl py-2 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-white/30 shadow-sm relative z-10"
                 />
              </div>
           </div>

           {/* Custom Modern Dropdown Component */}
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
            <span className="text-[13px] font-semibold text-white/60 tracking-widest uppercase">{filteredEvents.length} Active Opportunities</span>
         </div>
         <div className="flex-1 h-px bg-gradient-to-r from-primary/20 via-white/5 to-transparent" />
      </div>

      {/* Grid */}
      <div className="relative z-10">
        {isLoading && (!displayEvents || displayEvents.length === 0) ? (
          <div className="flex items-center justify-center p-20">
             <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredEvents.map(event => {
                const rewardText = event.referral_reward_type === "percentage" 
                    ? `${event.referral_reward_percentage}% Reward`
                    : `₦${Number(event.referral_reward_amount || 0).toLocaleString()} Reward`;

                return (
                    <EventCard 
                        key={event.event_id}
                        eventId={event.event_id}
                        eventSlug={event.event_slug}
                        name={event.name}
                        location={event.location}
                        reward={rewardText}
                        date={new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        image={event.image}
                    />
                );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredEvents.length === 0 && (
           <div className="flex flex-col items-center justify-center text-center py-24 bg-white/[0.02] rounded-[32px] border border-white/5">
              <Compass size={32} className="text-white/20 mb-6 stroke-[1.5]" />
              <h3 className="text-[15px] font-medium text-white mb-2">No programs found</h3>
              <p className="text-white/40 text-[13px] max-w-sm">We couldn't find any events matching your selected category.</p>
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
    <div className="relative w-full lg:w-[200px] group" ref={dropdownRef}>
      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition duration-500 blur-sm pointer-events-none" />
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 w-full h-12 bg-[#161622] border border-white/5 hover:border-white/10 rounded-2xl px-5 flex items-center justify-between text-sm font-medium text-white/90 focus:outline-none focus:border-primary/50 transition-all shadow-sm"
        type="button"
      >
        {value}
        <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#161622] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] z-[9999] animate-fade-in origin-top p-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-all rounded-xl ${
                opt === value 
                  ? "bg-primary text-white font-bold" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
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