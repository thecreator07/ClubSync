// NewLandingPage.tsx
"use client";

import Hero from "./home/Hero";
import HowItWorks from "./home/HowItWorks";
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
// import { useGetMainDataQuery } from "@/services/api/main";
import { useEffect, useState } from "react";
import { PopularClubsCarousel } from "./home/ClubCarousel";
import { UpcomingEventsGrid } from "./home/EventsGrid";

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

  const [clubs, setClubs] = useState<ClubWithImage[]>([]);
  const [events, setEvents] = useState<EventWithImage[]>([]);
  useEffect(() => {
    fetch("/api/landing")
      .then((res) => res.json())
      .then((data) => {
        setClubs(data.clubData);
        setEvents(data.eventsData);
      })
      .catch((err:unknown) => {
        console.error("Failed to fetch landing data:", err instanceof Error?err.message:"failed");
      });
  }, []);

  return (
    <div className="">
      <Hero />
      <HowItWorks />
      <PopularClubsCarousel
        clubs={clubs}
      />
      <UpcomingEventsGrid events={events} />
      <SuccessStories />
      <FinalCta />
      <Footer />
    </div>
  );
}
