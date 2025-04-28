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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/clubs/${slug}`);
        const data = await res.json();
        console.log(data);
        setClub(data.club);
        setUpcoming(data.upcomingEvents);
        setPast(data.pastEvents);
        setMembers(data.members);
        // if (session) {
        //   setJoined(data.isMember);
        // }
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
        toast.error("You are already a member of this club.");
        setJoined(true);
        return;
      }

      if (!res.ok) throw new Error(json.message);

      toast.success(json.message);
      setJoined(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Join failed");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!club) return <div className="p-8 text-center">Club not found</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      {/* Banner Carousel */}
      {club.coverImages?.length > 0 && (
        <Swiper loop autoplay={{ delay: 3000 }} className="rounded-xl h-64">
          {club.coverImages.map((url, i) => (
            <SwiperSlide key={i}>
              <Image
                width={80}
                src={url}
                alt={`Cover ${i}`}
                className="w-full h-64 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* Club Header */}
      <div className="flex items-center space-x-4">
        <Image
          width={80}
          height={80}
          src=""
          alt="Logo"
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h1 className="text-3xl font-bold">{club.name}</h1>
          <p className="text-gray-600">{club.description}</p>
        </div>
      </div>
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
      Join/Leave Button
      <div>
        <Button
          onClick={handleJoin}
          disabled={joined}
          className={`bg-blue-500 text-white py-2 px-4 rounded ${
            joined ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {joined ? "Member" : "Join"}
        </Button>
      </div>
      {/* About Section */}
      <section className="prose">
        <h2>About</h2>
        <p>{club.about}</p>
      </section>
      {/* Upcoming Events */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {upcoming.length ? (
          upcoming.map((evt) => (
            <div key={evt.id} className="border p-4 rounded-lg mb-3">
              <h3 className="font-semibold text-lg">{evt.name}</h3>
              <time className="text-sm text-gray-500">
                {new Date(evt.startDate).toLocaleDateString()}
              </time>
              <p className="mt-1 text-gray-700 truncate">{evt.description}</p>
              <Button
                size="sm"
                onClick={() => router.push(`/events/${evt.id}`)}
                className="mt-2"
              >
                View & Register
              </Button>
            </div>
          ))
        ) : (
          <p>No upcoming events.</p>
        )}
      </section>
      {/* Past Events */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
        {past.length ? (
          <div className="flex space-x-4 overflow-x-auto">
            {past.map((evt) => (
              <div
                key={evt.id}
                className="min-w-[200px] bg-gray-100 p-4 rounded-lg"
              >
                <h3 className="font-semibold">{evt.name}</h3>
                <time className="text-sm text-gray-500">
                  {new Date(evt.startDate).toLocaleDateString()}
                </time>
              </div>
            ))}
          </div>
        ) : (
          <p>No past events.</p>
        )}
      </section>
      {/* Members Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Members</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {members.map((m) => (
            <div key={m.id} className="flex flex-col items-center">
              <Image
                width={80}
                height={80}
                src={m.profilePic || "/avatar.png"}
                alt={"hahaaha"}
                className="w-16 h-16 rounded-full object-cover"
              />
              <p className="mt-2 font-medium">
                {m.firstname} {m.lastname}
              </p>
              <p className="text-xs text-gray-500 capitalize">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Contact Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <ul className="space-y-1">
          {club.contactEmail && (
            <li>
              Email:{" "}
              <a href={`mailto:${club.contactEmail}`} className="text-blue-600">
                {club.contactEmail}
              </a>
            </li>
          )}
          {club.contactPhone && (
            <li>
              Phone:{" "}
              <a href={`tel:${club.contactPhone}`} className="text-blue-600">
                {club.contactPhone}
              </a>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
