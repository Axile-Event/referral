import { Search, Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { EventCard } from "@/components/event/event-card.jsx";

/**
 * Events List Page
 * Displays referral-enabled events in a grid.
 */
export default function EventsPage() {
  const events = [
    { id: "1", name: "Axile Creative Hangout 2026", date: "April 12, 2026", reward: 250, image: "https://images.unsplash.com/photo-1540575861501-7ce0e22042f9?q=80&w=2070&auto=format&fit=crop" },
    { id: "2", name: "Tech Summit Lagos", date: "May 5, 2026", reward: 500, image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2073&auto=format&fit=crop" },
    { id: "3", name: "Music Festival Week", date: "June 20, 2026", reward: 150, image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070&auto=format&fit=crop" },
    { id: "4", name: "Startup Pitch Day", date: "July 15, 2026", reward: 300, image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" },
  ];

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

      {/* Events Grid */}
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
    </div>
  );
}
