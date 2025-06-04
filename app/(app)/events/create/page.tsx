"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useSession } from "next-auth/react";

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
      location: "",
      registrationLink: "",
    },
  });

  useEffect(() => {
    if (!session) return;
    const fetchClubs = async () => {
      try {
        const res = await fetch("/api/clubs");
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch clubs");
        setClubs(data.clubs);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to fetch clubs");
        }
      }
    };
    fetchClubs();
  }, [session]);

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
      if (!res.ok) throw new Error(json.message || "Failed to create event");

      toast("Event created!", {
        description: `“${json.data.name}” was created successfully.`,
      });

      router.push(`/events/${json.data.id}`);
    } catch (err) {
      toast("Error", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Create New Event</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-card p-6 rounded-2xl shadow-md border"
        >
          {/* Club Dropdown */}
          <FormField
            name="clubId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Club</FormLabel>
                <select
                  {...field}
                  className="w-full p-2 border rounded-md bg-background text-foreground"
                >
                  <option value="">Select a club</option>
                  {clubs
                    .filter(
                      (club) =>
                        session?.user?.clubId === undefined ||
                        club.id === Number(session.user.clubId)
                    )
                    .map((club) => (
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
            {
              name: "description",
              label: "Event Description",
              component: Textarea,
            },
            {
              name: "eventDate",
              label: "Event Date",
              component: Input,
              type: "date",
            },
            {
              name: "startTime",
              label: "Start Time",
              component: Input,
              type: "datetime-local",
            },
            {
              name: "endTime",
              label: "End Time",
              component: Input,
              type: "datetime-local",
            },
            { name: "location", label: "Location", component: Input },
            {
              name: "registrationLink",
              label: "Registration Link",
              component: Input,
            },
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
                    className={`w-full px-3 py-2 rounded-md border text-sm bg-background text-foreground
    ${
      type === "date" || type === "datetime-local"
        ? "appearance-none pr-10 relative"
        : ""
    }
  `}
                    placeholder={label}
                    {...(Component === Textarea ? { rows: 5 } : {})}
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
