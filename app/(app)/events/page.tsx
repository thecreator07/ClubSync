"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { eventSelectSchema } from "@/db/schema&relation";
// import { eventSelectSchema } from "@/db/schema";
import { useGetEventsQuery } from "@/services/api/events";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

type EventSchema = z.infer<typeof eventSelectSchema>;

export default function EventsPage() {
  const [search, setSearch] = useState<string>("");
  const [events, setEvents] = useState<EventSchema[] | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetEventsQuery(undefined);
  console.log(data, "data from events page");
  useEffect(() => {
    if (data?.data) {
      setEvents(data.data);
    } else {
      refetch();
    }
  }, [data, refetch]);

  if (isLoading) return <p>Loading events...</p>;
  if (error)
    return <p className="text-red-500">Error: {JSON.stringify(error)}</p>;

  const filteredEvents = events?.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 rounded-2xl mb-8 shadow-md">
        <h1 className="text-4xl font-bold">Discover College Events</h1>
        <p className="text-md mt-2">
          Stay up-to-date, join events, keep learning!
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        {session?.user?.role === "admin" && (
          <Button
            variant="outline"
            onClick={() => router.push("/events/create")}
          >
            ➕ Add New Event
          </Button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents?.map((event: EventSchema) => (
          <Card
            key={event.id}
            className="h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardHeader>
              <CardTitle
                onClick={() => router.push(`events/${event.id}`)}
                className="text-xl font-semibold cursor-pointer hover:underline"
              >
                {event.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
            </CardHeader>

            <CardContent className="flex flex-col justify-between flex-1 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {event.description}
              </p>
              <div className="text-sm">
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {event.startTime
                    ? new Date(event.startTime).toLocaleTimeString()
                    : "N/A"}{" "}
                  -{" "}
                  {event.endTime
                    ? new Date(event.endTime).toLocaleTimeString()
                    : "N/A"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`events/${event.id}`)}
                >
                  View
                </Button>

                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    className="text-blue-600 text-sm underline"
                  >
                    Register
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
