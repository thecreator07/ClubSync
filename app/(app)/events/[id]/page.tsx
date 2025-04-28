"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import imagepic from "../../../../static/image.png";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Event = {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventImage: string;
  location: string;
  registrationLink: string;
  club: {
    name: string;
    logoUrl: string;
    description: string;
  };
};

export default function EventPage() {
  // const router = useRouter();
  const { id } = useParams(); // Assuming slug is available via router query
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Event not found");
          return;
        }

        setEvent(data.data);
      } catch (error) {
        toast.error("Failed to fetch event details");
        console.error(error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center rounded-2xl p-4 bg-gray-900 text-white">
        <Image
          src={imagepic}
          alt="Club Logo"
          className="w-16 h-16 object-cover rounded-full"
        />

        <div className="flex gap-10">
          <Link href="/clubs" className="mr-4">
            Clubs
          </Link>
          <Link href="/events" className="mr-4">
            Events
          </Link>
          <Link href="/sign-in" className="mr-4">
            Login
          </Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      {/* Hero Banner Image */}
      <div
        className="w-full h-[300px] bg-cover bg-center"
        style={{ backgroundImage: `url(${imagepic})` }}
      ></div>

      {/* Event Info Section */}
      <section className="mt-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{event.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <p>{new Date(event.eventDate).toLocaleDateString()}</p>
              <p>
                {`${new Date(
                  event.startTime
                ).toLocaleTimeString()} - ${new Date(
                  event.endTime
                ).toLocaleTimeString()}`}
              </p>
              <p>{event.location}</p>
              {event.registrationLink && (
                <p>
                  <Link
                    href={event.registrationLink}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    Register Now
                  </Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* About the Event */}
      <section className="mt-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              About the Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{event.description}</p>
          </CardContent>
        </Card>
      </section>

      {/* Organized By */}
      <section className="mt-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Organized By:</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Image
              src={imagepic}
              alt="Club Logo"
              className="w-16 h-16 object-cover rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">{event.club.name}</h3>
              <p>{event.club.description}</p>
              <Link
                href={`/clubs/${event.club.name}`}
                className="text-blue-500"
              >
                View Club Page
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Event Gallery */}
      <section className="mt-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Event Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 overflow-x-auto">
              {/* Placeholder for gallery images */}
              <Image
                src={imagepic}
                alt="Event Image"
                className="w-64 h-40 object-cover rounded-md"
              />
              {/* More images can be added here */}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl  font-bold">Participants</h2>
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>

            <span>+50 more</span>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="mt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold">
            Past Events by {event.club.name}
          </h2>
          <div className="flex space-x-4 overflow-x-auto py-4">
            <div className="w-60 bg-gray-600 p-4 rounded-md">
              <h3 className="font-semibold">Event 1</h3>
              <p className="text-sm">Description of Event 1</p>
            </div>
            <div className="w-60 bg-gray-600 p-4 rounded-md">
              <h3 className="font-semibold">Event 2</h3>
              <p className="text-sm">Description of Event 2</p>
            </div>
            <div className="w-60 bg-gray-600 p-4 rounded-md">
              <h3 className="font-semibold">Event 3</h3>
              <p className="text-sm">Description of Event 3</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-8 flex justify-center">
        <div className="w-full max-w-4xl text-center px-4">
          <h2 className="text-2xl font-bold mb-2">Final Call to Action</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Don't miss your chance to be part of innovation!
          </p>
          <Link href={event.registrationLink} passHref>
            <Button
              
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Register Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p>&copy; 2025 Your Organization. All Rights Reserved.</p>
        <div>
          <Link href="/about" className="mr-4">
            About
          </Link>
          <Link href="/contact" className="mr-4">
            Contact
          </Link>
          <Link href="/privacy" className="mr-4">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
