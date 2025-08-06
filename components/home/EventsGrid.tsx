"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { useRouter } from "next/navigation";
import { EventWithImage } from "../LandindPage";
// import { EventWithImage } from "../HomePage";

interface UpcomingEventsGridProps {
  events: EventWithImage[];
  // isLoading: boolean;
  // isError: boolean;
}

export const UpcomingEventsGrid: React.FC<UpcomingEventsGridProps> = ({
  events
}) => {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black py-20 px-6 md:px-12 lg:px-24">

      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Upcoming Events
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Stay ahead and don&apos;t miss out. Here are the events lined up for you on campus.
        </p>

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
      </div>
    </section>
  );
};
