"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import impic from "../public/image.png";
import {
  clubImageSelectSchema,
  eventImageSelectSchema,
} from "@/db/schema/images";
import { z } from "zod";
// import { useGetmainDataQuery } from "@/services/api/main";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
// import { CardDemo } from "./Card";
// import Autoplay from "embla-carousel-autoplay";
import AutoScroll from "embla-carousel-auto-scroll";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import Link from "next/link";
import { CLubCard } from "./Card";
import { useGetMainDataQuery } from "@/services/api/main";
import { clubSelectSchema, eventSelectSchema } from "@/db/schema&relation";

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
export default function LandingPage() {
  const { data, error, refetch, isFetching } = useGetMainDataQuery(undefined);
  const [fetchStatus, setFetchStatus] = useState("idle"); // 'idle' | 'fetching' | 'error'
  const [clubs, setClubs] = useState<ClubWithImage[]>([]);
  const [events, setEvents] = useState<EventWithImage[]>([]);
  const router = useRouter();

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
  console.log(data, error);
  // const areaClasses = ["feature", "secondary", "tertiary"];
  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="  py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Connect. Create. Celebrate!</h1>
        <p className="text-lg mb-6">Join clubs, attend events, and grow!</p>
        <Button
          onClick={() => router.push("clubs/")}
          className="text-lg px-6 py-3 bg-white text-indigo-600 hover:bg-gray-100"
        >
          Explore Clubs
        </Button>
        <div className="mt-10">
          <Image
            src={impic}
            priority
            alt="College Vibe"
            width={800}
            height={400}
            className="mx-auto w-full h-auto max-w-[800px] rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🔍",
              title: "Discover Clubs",
              desc: "Find clubs based on your passion.",
            },
            {
              icon: "🎉",
              title: "Join Events",
              desc: "Take part in exciting activities.",
            },
            {
              icon: "🏆",
              title: "Earn Rewards",
              desc: "Get rewarded for your involvement.",
            },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-xl">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR CLUBS */}
      <section className="px-10 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-center">Popular Clubs</h2>
        {/* <div className="carousel-container"> */}
        {fetchStatus === "fetching" && <p>Loading...</p>}
        {fetchStatus === "error" && <p>Error fetching data. Retrying...</p>}
        {fetchStatus === "idle" && (
          <Carousel
            opts={{
              loop: true,
              // direction:"ltr",
            }}
            plugins={[
              AutoScroll({
                speed: 1, // Adjust the speed as needed
                startDelay: 1000, // Delay before auto-scrolling starts
                direction: "forward", // Scrolls to the right
                stopOnInteraction: true,
                stopOnMouseEnter: true,
                // active: true,
              }),
              // Autoplay({
              //   delay:2000,
              // })
            ]}
            className="w-full "
          >
            <CarouselContent className="">
              {clubs &&
                clubs.length > 0 &&
                clubs.map((club, i) => (
                  <CarouselItem
                    key={club.clubs.id || i}
                    className=" md:basis-1/2 lg:basis-1/3"
                  >
                    <CLubCard
                      imageUrl={club.club_images.imageUrl}
                      name={club.clubs.name}
                      description={club.clubs.description}
                      slug={club.clubs.slug}
                      onViewClick={() =>
                        router.push(`/clubs/${club.clubs.slug}`)
                      }
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="cursor-pointer" />
            <CarouselNext className="cursor-pointer" />
          </Carousel>
        )}
        {/* </div> */}
      </section>

      {/* UPCOMING EVENTS */}
      <section className="px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold  mb-10 text-center">
          Upcoming Events
        </h2>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto"> */}
        <BentoGrid className="w-full complexGrid">
          {events && events.length > 0 &&
            events.map((event, i) => (
              <BentoGridItem
                key={i}
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
        {/* </div> */}
      </section>

      {/* SUCCESS STORIES */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Student Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="text-center">
              <CardContent className="p-6">
                <Image
                  loading="lazy"
                  src={impic}
                  alt="Student"
                  width={80}
                  height={80}
                  className="mx-auto w-auto h-auto rounded-full mb-4"
                />
                <p className="italic">
                  &quot;Joining the Tech Club boosted my confidence.&quot;
                </p>
                <p className="mt-2 font-semibold">- Aryan Patel</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* GAMIFICATION */}
      {/* <section className="text-center text-black bg-yellow-100 py-12 px-6">
        <div className="text-5xl mb-4">🏅</div>
        <h2 className="text-2xl font-bold mb-2">
          Collect points, earn rewards!
        </h2>
        <Button variant="default">See Rewards</Button>
      </section> */}

      {/* FINAL CTA */}
      <section className="  text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Join the Best Communities?
        </h2>
        <Button onClick={() => router.push('/sign-up')} className="bg-white text-indigo-600 text-lg px-6 py-3">
          Sign Up Now
        </Button>
      </section>

      {/* FOOTER */}
      <Card className="bg-gray-50 dark:bg-gray-900 border-none">
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Repeat for each column */}
            <div>
              <h4 className="font-semibold mb-2">ClubSync</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="#">About</Link>
                </li>
                <li>
                  <Link href="#">Team</Link>
                </li>
              </ul>
            </div>
            {/* … */}
          </div>
        </CardContent>
        <CardFooter className="justify-between flex-wrap">
          <span className="text-xs text-gray-500">&copy; 2025 MyCorp</span>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Twitter">
              🐦
            </Link>
            <Link href="#" aria-label="GitHub">
              🐙
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
