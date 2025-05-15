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
  // CardDescription,
  CardContent,
  // CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  clubSelectSchema,
  clubUpdateSchema,
  eventRegistrationSelectSchema,
  eventSelectSchema,
  eventUpdateSchema,
  userSelectSchema,
} from "@/db/schema";
import { eventImageSelectSchema } from "@/db/schema/images";
import { AnimatedTooltipPreview, Item } from "@/components/Tooltip";
import { useSession } from "next-auth/react";

type EventProfileData = z.infer<typeof eventSelectSchema>;
type AssociatedClub = z.infer<typeof clubSelectSchema>;
type Imagegallery = z.infer<typeof eventImageSelectSchema>;
const eventregisteredUser = eventRegistrationSelectSchema.extend({
  user: userSelectSchema,
});
type registerdUser = z.infer<typeof eventregisteredUser>;
// type Event = {
//   id: number;
//   name: string;
//   description: string;
//   eventDate: string;
//   startTime: string;
//   endTime: string;
//   eventImage: string;
//   location: string;
//   registrationLink: string;
//   club: {
//     name: string;
//     logoUrl: string;
//     description: string;
//   };
// };

export default function EventPage() {
  const { data: session } = useSession();
  // const router = useRouter();
  const { id } = useParams(); // Assuming slug is available via router query
  const [event, setEvent] = useState<EventProfileData | null>(null);
  const [RegisteredUser, setRegisteredUser] = useState<registerdUser[] | null>(
    null
  );
  const [IsRegistered, setIsRegistered] = useState<boolean>(false);
  const [AssociatedClub, setAssosciatedClub] = useState<AssociatedClub | null>(
    null
  );
  const [tooltip, settooltip] = useState<Item[] | null>(null);
  const [ImageList, setImageList] = useState<Imagegallery[] | null>(null);

  // console.log(tooltip);
  // console.log(session?.user.id);

  const handleRegister = async () => {
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to register for event");
        return;
      }

      toast.success("Successfully registered for the event");
      setIsRegistered(true);
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error("Register error:", error);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`, {
          next: { revalidate: 60, tags: [`events/${id}`] },
        });
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          toast.error(data.message || "Event not found");
          return;
        }

        setEvent(data?.event);
        setAssosciatedClub(data?.eventAssociatedClub[0]);
        setImageList(data?.eventsImageList);
        setRegisteredUser(data?.eventRegisterList);
        const tooltipData: Item[] =
          data?.eventRegisterList?.map((reg: registerdUser) => ({
            id: reg.user.id,
            name: reg.user.firstname || "N/A",
            image: reg.user.avatar,
          })) || [];
        settooltip(tooltipData);
        if (tooltip) {
          const registered = tooltip?.every(
            (arg) => arg.id === session?.user.id
          );
          setIsRegistered(registered);
        }
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
                {event.startTime
                  ? `${new Date(event.startTime).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "numeric",
                    })}`
                  : "N/A"}
                {" - "}
                {event.endTime
                  ? new Date(event.endTime).toLocaleTimeString(undefined, {
                    day:"2-digit",  
                    hour: "numeric",
                      minute: "numeric",
                    })
                  : "N/A"}
              </p>
              <p>{event.location}</p>
              {event.registrationLink && (
                <p>
                  <Link
                    href={event.registrationLink}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    Registration
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
              <h3 className="text-xl font-semibold">{AssociatedClub?.name}</h3>
              <p>{AssociatedClub?.description}</p>
              <Link
                href={`/clubs/${AssociatedClub?.name}`}
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
              {ImageList&& ImageList[0] && (
                <Image
                  src={ImageList[0]?.imageUrl}
                  width={96}
                  height={96}
                  alt="Event Image"
                  className="w-64 h-40 object-cover rounded-md"
                />
              )}
              {/* More images can be added here */}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <div className="max-w-4xl mx-auto ">
          <h2 className="text-2xl  font-bold">Participants</h2>
          <AnimatedTooltipPreview items={tooltip || []} />
        </div>
      </section>

      {/* Past Events */}
      <section className="mt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold">
            Past Events by {AssociatedClub?.name}
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
            Don&apos;t miss your chance to be part of innovation!
          </p>
          {/* <Link href={event.registrationLink} passHref> */}
          <Button
            onClick={handleRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {IsRegistered ? "registered" : "Register Now"}
          </Button>
          {/* </Link> */}
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
