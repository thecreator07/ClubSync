// app/clubs/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import impic from "../../../../static/image.png";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Club {
  id: number;
  name: string;
  slug: string;
  description: string;
  about: string;
  contactEmail?: string;
  contactPhone?: string;
  coverImages: string[];
  logoImage?: string;
  verified: number;
}

interface Event {
  id: number;
  name: string;
  startDate: string;
  description: string;
  eventDate: string;
}

interface Member {
  id: number;
  email: string;
  profilePic?: string;
  firstname: string | undefined;
  lastname: string | undefined;
  role: string;
}

export default function ClubPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [club, setClub] = useState<Club | null>(null);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  // const {update} = useSession()
  // console.log(session, "session in club page")
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/clubs/${slug}`);
        const data = await res.json();
        // console.log(data);
        setClub(data.club);
        setUpcoming(data.upcomingEvents);
        setPast(data.pastEvents);
        setMembers(data.members);
        if (session) {
          setJoined(data.isMember);
        }
      } catch {
        toast.error("Failed to load club data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, session]);

  const handleJoin = async () => {
    if (!session) return router.push("/sign-in");
    try {
      const res = await fetch(`/api/clubs/${slug}/register`, {
        method: "POST",
      });
      const json = await res.json();

      if (res.status === 409) {
        // toast.error(''"You are already a member of this club.");
        toast.error("Error", {
          description: json.message,
          duration: 2000,
        });
        setJoined(false);
        return;
      }

      if (!res.ok) throw new Error(json.message);

      toast.success("Success", { description: json.message, duration: 2000 });
      setJoined(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Error", {
          description: err.message || "Join failed",
          duration: 2000,
        });
      } else {
        toast.error("Error", {
          description: "An unknown error occurred",
          duration: 2000,
        });
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!club) return <div className="p-8 text-center">Club not found</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      {/* Banner Carousel */}
      {club.coverImages?.length > 0 && (
        <Swiper
          loop
          autoplay={{ delay: 3000 }}
          className="rounded-xl h-64 border-2 border-amber-50"
        >
          {club.coverImages.map((url, i) => (
            <SwiperSlide key={i}>
              <Image
                width={80}
                src={impic}
                alt={`Cover ${i}`}
                className="w-full h-64 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* Club Header */}
      <Card className="w-full max-w-5xl border border-amber-800 shadow-md rounded-lg p-4">
        <CardHeader className="flex  space-x-4">
          <Image
            src={impic}
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full border"
          />
          <div>
            <CardTitle className="text-2xl font-bold">{club.name}</CardTitle>
            <CardDescription className="text-gray-600">
              {club.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>{/* Additional content can be placed here */}</CardContent>
      </Card>
      {/* President & Stats */}
      <div className="flex items-center space-x-6">
        {members.find((m) => m.role === "president") && (
          <div className="flex items-center space-x-2">
            {/* <img
              src={members.find(m => m.role === 'president')?.user.profilePic || ''}
              alt="President"
              className="w-12 h-12 rounded-full"
            /> */}
            {/* <span>
              President:{" "}
              {members.find((m) => m.role === "president")?.user.firstname}{" "}
              {members.find((m) => m.role === "president")?.user.lastname}
            </span> */}
          </div>
        )}
        <div>Total Members: {members.length}</div>
      </div>
      <div className="flex items-center space-x-4">
        {session && session.user && session.user.role !== "admin" && (
          <Button
            onClick={handleJoin}
            disabled={joined}
            className={`py-2 px-4 rounded ${
              joined
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {joined ? "Member" : "Join"}
          </Button>
        )}
        {/* {console.log(session?.user.clubRole, "session in club page")} */}
        {["president", "secretary", "treasurer"].includes(
          session?.user.clubRole
        ) &&
          session?.user.clubId === club.id && (
            <Button
              onClick={() => router.push(`/events/create`)}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              create event
            </Button>
          )}
      </div>
      {/* About Section */}
      <section className="prose">
        <h2 className="font-bold">About</h2>
        <p>{club.about}</p>
      </section>
      {/* Upcoming Events */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {upcoming.length > 0 ? (
          upcoming.map((evt) => (
            <Card
              key={evt.id}
              className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader onClick={() => router.push(`/events/${evt.id}`)}>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {evt.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <time className="block text-sm text-gray-500">
                  {new Date(evt.eventDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <p className="mt-2 text-gray-700 line-clamp-3">
                  {evt.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  onClick={() => router.push(`/events/${evt.id}`)}
                >
                  View & Register
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No upcoming events.</p>
        )}
      </section>
      {/* Past Events */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
        {past.length > 0 ? (
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {past.map((evt) => (
                <Card
                  key={evt.id}
                  className="min-w-[200px] bg-gray-700 p-4 rounded-lg"
                >
                  <CardHeader onClick={() => router.push(`/events/${evt.id}`)}>
                    <CardTitle className="text-lg font-semibold">
                      {evt.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <time className="text-sm text-gray-500">
                      {new Date(evt.eventDate).toLocaleDateString()}
                    </time>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p>No past events.</p>
        )}
      </section>
      {/* Members Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Members</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {members.map((m) => (
            <Card key={m.id} className="flex flex-col items-center p-4">
              <CardHeader className="flex flex-col items-center">
                <Image
                  width={64}
                  height={64}
                  src={impic}
                  alt={`${m.firstname} ${m.lastname}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <CardTitle className="mt-2 text-center">
                  {m.firstname}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500 capitalize text-center">
                  {m.role}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* Contact Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {club.contactEmail && (
                <li>
                  <span className="font-medium">Email: </span>
                  <a
                    href={`mailto:${club.contactEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {club.contactEmail}
                  </a>
                </li>
              )}
              {club.contactPhone && (
                <li>
                  <span className="font-medium">Phone: </span>
                  <a
                    href={`tel:${club.contactPhone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {club.contactPhone}
                  </a>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
