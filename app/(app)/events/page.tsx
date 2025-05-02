// app/events/page.tsx
"use client";

import { useEvents } from "@/hooks/useEvents";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const {data: session} =useSession()
  const router = useRouter();

  console.log(session, 'session in events page')
  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <ul className="space-y-4">
        {events.map((event) => (
          <li
            key={event.id}
            className="border p-4 rounded shadow bg-white dark:bg-gray-800"
          >
            <h2
              className="text-xl font-semibold"
              onClick={() => router.push(`events/${event.id}`)}
            >
              {event.name}
            </h2>
            <p className="text-gray-500">
              {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p>{event.description}</p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(event.startTime).toLocaleTimeString()} -{" "}
              {new Date(event.endTime).toLocaleTimeString()}
            </p>
            {event.registrationLink && (
              <a
                href={event.registrationLink}
                className="text-blue-500 underline"
                target="_blank"
              >
                Register here
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
