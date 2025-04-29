// app/events/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { eventCreateSchema } from "@/schemas/eventCreateSchema";

type EventFormValues = z.infer<typeof eventCreateSchema>;

type Club = {
  id: number;
  name: string;
};

export default function CreateEventPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: {
      clubId: "",
      name: "",
      description: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      // eventImage: "",
      location: "",
      registrationLink: "",
    },
  });

  // Fetch clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch("/api/clubs/create", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const { data } = await res.json();
        setClubs(data);
      } catch (error) {
        console.error("Failed to fetch clubs", error);
      }
    };
    fetchClubs();
  }, []);

  const onSubmit = async (data: EventFormValues) => {
    if (!session) {
      toast.error("Please login first");
      router.push("/sign-in");
      return;
    }

    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to create event");
      }
console.log(json)
      toast("Event created!", {
        description: `Event “${json.data.name}” created successfully!`,
        duration: 5000,
      });

      router.push(`/events/${json.data.id}`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast("Error", { description: errorMessage, duration: 5000 });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Club Dropdown */}
          <FormField
            name="clubId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Club</FormLabel>
                <select
                  {...field}
                  className="w-full p-2 border rounded bg-background text-foreground"
                >
                  <option value="">Select a Club</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other Fields */}
          {[
            { name: "name", label: "Event Name", component: Input },
            { name: "description", label: "Event Description", component: Textarea },
            { name: "eventDate", label: "Event Date", component: Input, type: "date" },
            { name: "startTime", label: "Start Time", component: Input, type: "datetime-local" },
            { name: "endTime", label: "End Time", component: Input, type: "datetime-local" },
            // { name: "eventImage", label: "Event Image URL", component: Input },
            { name: "location", label: "Location", component: Input },
            { name: "registrationLink", label: "Registration Link", component: Input },
          ].map(({ name, label, component: Component, type }) => (
            <FormField
              key={name}
              name={name as keyof EventFormValues}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <Component
                    {...field}
                    type={type}
                    placeholder={label}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
