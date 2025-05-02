// hooks/useEvents.ts
import { useEffect, useState } from "react";

export type Event = {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  registrationLink: string;
  clubId: number;
};

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
      } catch (err:unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}
