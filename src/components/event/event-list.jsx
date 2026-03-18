import { EventCard } from "./event-card";

/**
 * Event List Component
 * Renders a grid of EventCards.
 * Props: events (array of Event objects)
 */
export function EventList({ events = [] }) {
  if (events.length === 0) {
    return <p className="text-muted-foreground text-sm">No events found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          eventId={event.id}
          name={event.name}
          date={event.date}
          reward={event.referralReward}
          image={event.image}
        />
      ))}
    </div>
  );
}
