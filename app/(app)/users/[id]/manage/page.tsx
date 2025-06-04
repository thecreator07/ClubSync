// app/profile/manage/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { useSession } from "next-auth/react";

type ProfileFormValues = z.infer<typeof userUpdateSchema>;

export default function ManageProfilePage() {
  const router = useRouter();
  const { data: session } = useSession(); 

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      phone: "",
      aoi: "",
      department: "",
      year: "",
      semester: "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to update profile.");
      }
      console.log(session?.user?.id);
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(data);
      const json = await res.json();
      console.log(json);
      if (!res.ok) {
        throw new Error(json.message || "Failed to update profile");
      }

      toast("Profile updated!", {
        description: `Your profile was updated successfully.`,
        duration: 5000,
      });
      router.push(`/users/${session?.user?.id}/profile`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast("Error", { description: errorMessage, duration: 5000 });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {[
            { name: "firstname", label: "First Name", component: Input },
            { name: "lastname", label: "Last Name", component: Input },
            { name: "phone", label: "Phone Number", component: Input },
            { name: "department", label: "Department", component: Input },
            { name: "year", label: "Year", component: Input },
            { name: "semester", label: "Semester", component: Input },
            { name: "aoi", label: "area of interest", component: Input },
          ].map(({ name, label, component: Component }) => (
            <FormField
              key={name}
              name={name as keyof ProfileFormValues}
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
            {form.formState.isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
