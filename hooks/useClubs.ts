// hooks/useClubs.ts
import { clubSelectSchema } from "@/db/schema";
import { useEffect, useState } from "react";
import { z } from "zod";

export type Club = z.infer<typeof clubSelectSchema>

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch("/api/clubs");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch clubs");

        setClubs(json.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return { clubs, loading, error };
}
