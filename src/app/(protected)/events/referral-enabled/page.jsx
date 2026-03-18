import { Search, Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { EventCard } from "@/components/event/event-card.jsx";

/**
 * Events List Page
 * Displays referral-enabled events in a grid.
 */
export default function EventsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary animate-pulse">
        <Sparkles size={40} />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">Referral Events</h1>
      <p className="text-gray-400 font-medium tracking-tight">This page is currently under development.</p>
    </div>
  );
}
