// NewLandingPage.tsx
"use client";

import Hero from "./home/Hero";
import HowItWorks from "./home/HowItWorks";
// import ClubCarousel from "./home/ClubCarousel";
import SuccessStories from "./home/SuccessStories";
import FinalCta from "./home/FinalCTA";
import Footer from "./home/Footer";
import {
  clubImageSelectSchema,
  clubSelectSchema,
  eventImageSelectSchema,
  eventSelectSchema,
} from "@/db/schema&relation";
import { z } from "zod";
import { useGetMainDataQuery } from "@/services/api/main";
import { useEffect, useState } from "react";
import { PopularClubsCarousel } from "./home/ClubCarousel";
import { UpcomingEventsGrid } from "./home/EventsGrid";
// import Hero from "./components/landing/Hero";
// import HowItWorks from "./components/landing/HowItWorks";
// import ClubCarousel from "./components/landing/ClubCarousel";
// import EventsGrid from "./components/landing/EventsGrid";
// import SuccessStories from "./components/landing/SuccessStories";
// import FinalCTA from "./components/landing/FinalCTA";
// import Footer from "./components/landing/Footer";
type Club = z.infer<typeof clubSelectSchema>;
type Event = z.infer<typeof eventSelectSchema>;
type ClubImage = z.infer<typeof clubImageSelectSchema>;
type EventImage = z.infer<typeof eventImageSelectSchema>;
export type ClubWithImage = {
  clubs: Club;
  club_images: ClubImage;
};
export type EventWithImage = {
  events: Event;
  event_images: EventImage;
};
export default function NewLandingPage() {
  const { data, error, refetch, isFetching } = useGetMainDataQuery(undefined);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "fetching" | "error">(
    "idle"
  );
  const [clubs, setClubs] = useState<ClubWithImage[]>([]);
  const [events, setEvents] = useState<EventWithImage[]>([]);
//   const router = useRouter();

  useEffect(() => {
    if (isFetching) {
      setFetchStatus("fetching");
    } else if (data) {
      setFetchStatus("idle");
    } else if (error) {
      setFetchStatus("error");
    }
  }, [data, error, isFetching]);

  useEffect(() => {
    if (
      (data && data.clubData.length === 0) ||
      (data && data.eventsData.length === 0)
    ) {
      refetch();
    } else {
      setClubs(data?.clubData || []);
      setEvents(data?.eventsData || []);
    }
  }, [data, refetch]);

  return (
    <div className="relative">
      <Hero />
      <HowItWorks />
      <PopularClubsCarousel clubs={clubs} fetchStatus={fetchStatus} />
      <UpcomingEventsGrid events={events} />
      <SuccessStories />
      <FinalCta />
      <Footer />
    </div>
  );
}
