// app/clubs/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import { clubRegisterSchema } from "@/schemas/clubRegistrationSchema";

type ClubFormValues = z.infer<typeof clubRegisterSchema>;

export default function CreateClubPage() {
  const router = useRouter();

  const form = useForm<ClubFormValues>({
    resolver: zodResolver(clubRegisterSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      about: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = async (data: ClubFormValues) => {
    try {
      const res = await fetch("/api/clubs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      console.log(json);
      if (!res.ok) {
        throw new Error(json.message || "Failed to create club");
      }

      toast("Club created!", {
        description: `“${json.data.name}” is now sent to HOD for verification.`,
        duration: 5000,
      });
      router.push(`/clubs/${json.data.slug}`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast("Error", { description: errorMessage, duration: 5000 });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Club</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {[
            { name: "name", label: "Club Name", component: Input },
            { name: "slug", label: "URL Slug", component: Input },
            {
              name: "description",
              label: "Short Description",
              component: Textarea,
            },
            { name: "about", label: "About the Club", component: Textarea },
            { name: "contactEmail", label: "Contact Email", component: Input },
            { name: "contactPhone", label: "Contact Phone", component: Input },
          ].map(({ name, label, component: Component }) => (
            <FormField
              key={name}
              name={name as keyof ClubFormValues}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <Component {...field} placeholder={label} />
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
            {form.formState.isSubmitting ? "Creating..." : "Create Club"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
