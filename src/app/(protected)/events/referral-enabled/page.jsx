import { Search, Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { EventCard } from "@/components/event/event-card.jsx";

/**
 * Events List Page
 * Displays referral-enabled events in a grid.
 */
export default function EventsPage() {
  const events = []; // Empty for now to use placeholders

  return (
    <div className="space-y-12">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:row items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Sparkles size={14} className="fill-primary" />
            Explore Referral Opportunities
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Referral Events</h1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input placeholder="Search events..." icon={Search} className="bg-[#12121f] rounded-2xl border-white/5" />
          </div>
          <Button variant="outline" className="rounded-2xl border-white/5 bg-[#12121f] h-12">
            <Filter size={18} className="mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Events Grid / Empty State */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard 
              key={event.id}
              eventId={event.id}
              name={event.name}
              date={event.date}
              reward={event.reward}
              image={event.image}
            />
          ))}
        </div>
      ) : (
        <div className="p-20 bg-[#12121f] border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600">
            <Sparkles size={40} className="stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">No referral events found</h4>
            <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
              Check back later for new events with active referral programs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
