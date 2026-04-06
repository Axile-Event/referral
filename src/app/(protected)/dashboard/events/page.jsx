"use client";

import { useReferrableEvents } from "@/lib/hooks/useReferralQueries";
import { EventCard } from "@/components/referral/event-card.jsx";
import { AlertCircle, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  
  const {
    data: eventsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useReferrableEvents();

  // Basic auth check
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated, user, router]);

  if (!authChecked) {
    return null;
  }

  // Handle username missing case (formerly referee_id)
  const identifier = user?.username;
  if (!identifier) {
    return (
      <div className="p-8 sm:p-12 w-full h-[60vh] flex flex-col justify-center items-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Missing Referee Profile</h2>
        <p className="text-gray-400 max-w-sm">We could not verify your referee identity. Please ensure you have a username set in settings.</p>
        <Button onClick={() => router.push("/login")} className="mt-6 rounded-full px-8">
          Return to Login
        </Button>
      </div>
    );
  }

  // Wait for loading or error
  if (isLoading) {
    return (
      <div className="p-8 w-full h-[60vh] flex flex-col justify-center items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/5 rounded-full" />
          <Loader2 className="w-16 h-16 text-primary animate-spin absolute inset-0" />
        </div>
        <p className="text-gray-400 font-medium">Loading events...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 w-full h-[60vh] flex flex-col justify-center items-center text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Failed to Load Events</h2>
          <p className="text-gray-400 max-w-md">{error?.message || "Something went wrong while fetching the events marketplace."}</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="mt-4 border-white/10 hover:bg-white/5 rounded-full px-8">
          Try Again
        </Button>
      </div>
    );
  }

  // Filter events strictly for those that allow referrals
  const eventsData = Array.isArray(eventsResponse?.events) ? eventsResponse.events : (Array.isArray(eventsResponse) ? eventsResponse : []);
  const referrableEvents = eventsData.filter((evt) => evt.use_referral === true);

  return (
    <div className="p-6 md:p-10 w-full max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
             <Calendar className="w-5 h-5 text-primary" />
             <span className="text-sm font-semibold text-primary tracking-wide uppercase">Marketplace</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight">Refer and earn</h1>
          <p className="text-base text-gray-400 font-normal max-w-2xl pt-2">
            Browse referral-enabled events, generate your unique links, and track results.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex flex-col">
          <span className="text-xs font-medium text-gray-500">Available events</span>
          <span className="text-2xl font-bold text-white">{referrableEvents.length}</span>
        </div>
      </div>

      {/* Grid of events */}
      {referrableEvents.length === 0 ? (
        <div className="w-full flex justify-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5">
          <div className="text-center space-y-4 max-w-sm">
             <Calendar className="w-16 h-16 text-gray-600 mx-auto" />
             <h3 className="text-2xl font-semibold text-white">No events available</h3>
             <p className="text-gray-400">There are currently no events active in the referral marketplace. Check back soon!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {referrableEvents.map((event, index) => (
            <motion.div 
              key={event.event_id || event.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
               <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
