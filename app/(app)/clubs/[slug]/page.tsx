// app/clubs/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CldImage } from "next-cloudinary";
import { z } from "zod";
// import { membersListSchema } from "@/app/api/clubs/[slug]/route";
import { useGetClubBySlugQuery } from "@/services/api/clubs";
import { clubSelectSchema, eventSelectSchema } from "@/db/schema&relation";

type Club = z.infer<typeof clubSelectSchema>;

type Event = z.infer<typeof eventSelectSchema>;


export interface MemberWithRole {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar: string;
  role: string;
}

interface images {
  public_id: string;
  imageUrl: string | StaticImageData;
  imageType: string;
}

interface logoImages {
  public_id: string;
  imageUrl: string;
  imageType: string;
}

export default function ClubPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  // console.log(slug)
  const { data, isLoading, refetch, isError } = useGetClubBySlugQuery(
    slug as string
  );

  const [club, setClub] = useState<Club | null>(null);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [members, setMembers] = useState<MemberWithRole[]>([]);
  const [images, setImages] = useState<images[]>([]);
  const [logo, setlogo] = useState<logoImages | null>(null);
  const [joined, setJoined] = useState(false);
  // const [loading, setLoading] = useState(true);
  // if (data) {
  // }
  // const {update} = useSession()
  // console.log(session, "session in club page")
  // useEffect(() => {
  //   async function fetchData() {
  // try {
  // const data = await res.json();
  console.log(members);
  useEffect(() => {
    if (!slug) {
      return;
    }
    if (data) {
      setClub(data?.parsedclubData);
      setUpcoming(data?.upcomingEvents);
      setPast(data?.pastEvents);
      setMembers(data?.members);
      setImages(data?.heroImages);
      setlogo(data?.logoImages);
    } else {
      refetch();
    }
  }, [slug, data, refetch]);
  // if (session) {
  //   setJoined(data?.isMember);
  // }
  //   } catch {
  //     toast.error("Failed to load club data");
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  //   fetchData();
  // }, []);

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

  // Handle event deletion
  const handleDelete = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Error", {
          description: json.message || "Failed to delete event",
          duration: 2000,
        });
        return;
      }
      toast.success("Success", {
        description: json.message || "Event deleted successfully",
        duration: 2000,
      });
      // Remove deleted event from upcoming and past lists
      setUpcoming((prev) => prev.filter((evt) => evt.id !== Number(eventId)));
      setPast((prev) => prev.filter((evt) => evt.id !== Number(eventId)));
    } catch (err: unknown) {
      toast.error("Error", {
        description: err instanceof Error ? err.message : "Unknown error",
        duration: 2000,
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading club details…</div>;
  }
  if (isError || !data?.success) {
    return <div className="p-8 text-center">Failed to load club details.</div>;
  }
  if (!club) {
    return <div className="p-8 text-center">Club not found.</div>;
  }
  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      {/* Banner Carousel */}
      {images.length > 0 && (
        <Swiper
          modules={[Autoplay]}
          loop
          autoplay={{ delay: 2000 }}
          className="rounded-xl border-2 border-amber-50"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <Image
                width={1024}
                height={768}
                src={img.imageUrl}
                alt={`Cover ${i}`}
                className="w-full h-96 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* Club Header */}
      <Card className="w-full max-w-5xl border border-amber-800 shadow-md rounded-lg md:p-4">
        <CardHeader className="flex  md:space-x-4">
          {logo && logo.public_id && (
            <div className="flex-shrink-0 rounded-full overflow-hidden w-12 h-12 hidden md:block">
              <CldImage
                width={96}
                height={96}
                src={logo?.public_id}
                alt={logo?.imageType || "Club logo"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
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
        {/* {members.find((m) => === "president") && (
          <div className="flex items-center space-x-2">
            <img
              src={members.find(m => m.role === 'president')?.user.profilePic || ''}
              alt="President"
              className="w-12 h-12 rounded-full"
            />
            <span>
              President:{" "}
              {members.find((m) => m.role === "president")?.user.firstname}
              {members.find((m) => m.role === "president")?.user.lastname}
            </span>
          </div>
        )} */}
        <div>Total Members: {members.length}</div>
      </div>
      <div className="flex items-center space-x-4">
        {session && session.user && session.user.role !== "admin" ? (
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
        ):(
          <Button onClick={() => router.push(`/clubs/${club.slug}/upload`)}>upload</Button>
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
        {/* <TextGenerateEffect words={club.about}/> */}
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
              <CardFooter className="flex gap-2.5">
                <Button
                  size="sm"
                  onClick={() => router.push(`/events/${evt.id}`)}
                >
                  View & Register
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(String(evt.id))}
                >
                  Delete
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
                  className="min-w-[260px] max-w-xs bg-white border border-gray-200 shadow-md rounded-xl flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => router.push(`/events/${evt.id}`)}
                  >
                    <CardTitle className="text-lg font-bold text-gray-800 truncate">
                      {evt.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <time className="block text-xs text-gray-500 mb-2">
                      {new Date(evt.eventDate).toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {evt.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => router.push(`/events/${evt.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p>No past events.</p>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Members</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {members.map((m) => (
            <Card
              key={m.id}
              className="flex flex-col items-center p-4 
                       hover:shadow-lg transition-shadow rounded-2xl 
                       h-[220px] justify-between"
            >
              <CardHeader className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  {m.avatar ? (
                    <CldImage
                      width={64}
                      height={64}
                      src={m.avatar}
                      alt={`${m.firstname} ${m.lastname}`}
                      crop="fill"
                      gravity="auto"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      {/* Placeholder icon/text */}
                      <span className="text-xl">👤</span>
                    </div>
                  )}
                </div>
                <CardTitle className="mt-3 text-center line-clamp-1">
                  {m.firstname} {m.lastname}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500 capitalize text-center line-clamp-1">
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
