// hooks/useEvents.ts
import { eventSelectSchema } from "@/db/schema";
import { useEffect, useState } from "react";
import { z } from "zod";

type Event = z.infer<typeof eventSelectSchema>

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch events");

        setEvents(json.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}
