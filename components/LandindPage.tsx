"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import impic from "../static/image.png";
import { clubSelectSchema, eventSelectSchema } from "@/db/schema";
import {
  clubImageSelectSchema,
  eventImageSelectSchema,
} from "@/db/schema/images";
import { z } from "zod";

export default function LandingPage() {
  type Club = z.infer<typeof clubSelectSchema>;
  type Event = z.infer<typeof eventSelectSchema>;
  type ClubImage = z.infer<typeof clubImageSelectSchema>;
  type EventImage = z.infer<typeof eventImageSelectSchema>;
  type ClubWithImage = {
    clubs: Club;
    club_images: ClubImage;
  };
  type EventWithImage = {
    events: Event;
    event_images: EventImage;
  };

  const [clubs, setClubs] = useState<ClubWithImage[]>([]);
  const [events, setEvents] = useState<EventWithImage[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/landing");
        const data = await res.json();
        setClubs(data.clubData);
        setEvents(data.eventsData);
      } catch (err) {
        console.error("Failed to load landing data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6 text-center">
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
            width={800}
            height={400}
            alt="College Vibe"
            className="mx-auto rounded-xl shadow-lg"
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
      <section className="px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Popular Clubs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {clubs.map((club, i) => (
            <Card key={club.clubs.id || i} className="flex flex-col h-full">
              <CardContent className="flex flex-col items-center text-center p-4 h-full">
                {club.club_images?.imageUrl && (
                  <div className="w-24 h-24 mb-3">
                    <Image
                      src={club.club_images.imageUrl}
                      alt={club.clubs.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg">{club.clubs.name}</h3>
                <p className="text-sm text-gray-600 truncate max-w-[90%] mb-4">
                  {club.clubs.description}
                </p>
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`clubs/${club.clubs.slug}`)}
                  >
                    View Club
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="bg-gray-50 px-6 py-12">
        <h2 className="text-3xl font-bold text-black mb-10 text-center">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map((event) => (
            <Card
              key={event.events.id}
              className="flex flex-col h-full shadow-md"
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="h-40 w-full mb-3 overflow-hidden rounded-lg">
                  <Image
                    src={event.event_images?.imageUrl}
                    alt={event.events.name}
                    width={400}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {event.events.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {new Date(event.events.eventDate).toLocaleDateString()}
                </p>
                <div className="mt-auto">
                  <Button className="w-full" onClick={()=>router.push(`events/${event.events.id}`)}>View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="px-6 py-12 text-black max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Student Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="text-center">
              <CardContent className="p-6">
                <Image
                  src={impic}
                  alt="Student"
                  width={80}
                  height={80}
                  className="mx-auto rounded-full mb-4"
                />
                <p className="italic">
                  "Thanks to XYZ Club, I launched my startup!"
                </p>
                <p className="mt-2 font-semibold">- Aryan Patel</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* GAMIFICATION */}
      <section className="text-center text-black bg-yellow-100 py-12 px-6">
        <div className="text-5xl mb-4">🏅</div>
        <h2 className="text-2xl font-bold mb-2">
          Collect points, earn rewards!
        </h2>
        <Button variant="default">See Rewards</Button>
      </section>

      {/* FINAL CTA */}
      <section className="bg-indigo-600 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Join the Best Communities?
        </h2>
        <Button className="bg-white text-indigo-600 text-lg px-6 py-3">
          Sign Up Now
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto space-y-4 md:space-y-0">
          <Image src={impic} alt="Logo" width={120} height={40} />
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
          </div>
          <div className="flex space-x-4">
            {["Instagram", "Twitter", "GitHub"].map((alt, i) => (
              <a key={i} href="#">
                <Image src={impic} width={24} height={24} alt={alt} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
