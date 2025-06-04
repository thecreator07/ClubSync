"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { useRouter } from "next/navigation";
import { EventWithImage } from "../HomePage";
// import { EventWithImages } from "@/types"; // Adjust according to your actual type

interface UpcomingEventsGridProps {
  events: EventWithImage[];
}

export const UpcomingEventsGrid: React.FC<UpcomingEventsGridProps> = ({
  events,
}) => {
  const router = useRouter();

  return (
      <section className="px-10 pt-16 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-10 text-center">Upcoming Events</h2>

      <BentoGrid className="w-full complexGrid">
        {events &&
          events.length > 0 &&
          events.map((event, i) => (
            <BentoGridItem
              key={event.events.id || i}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              Id={String(event.events.id)}
              eventDate={event.events.eventDate}
              imageUrl={event.event_images.public_id}
              title={event.events.name}
              description={event.events.description}
              onViewEvent={() => router.push(`/events/${event.events.id}`)}
            />
          ))}
      </BentoGrid>
    </section>
  );
};
