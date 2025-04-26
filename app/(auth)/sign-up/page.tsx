// app/(auth)/sign-up/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { signUpSchema } from "@/schemas/signUpSchema";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponce";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  //   const { toast } = useToast();

  // Local state for username availability check

  // React Hook Form setup with Zod
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  // Submission handler
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const res = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log(res);
      toast("Success", {
        description: res.data.message,
        duration: 4000,
      });
      router.replace(`/sign-in}`);
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;

      console.log(error);
      toast.error("SignUp Failed", {
        description: error.response?.data.message ?? "Something went wrong",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-3xl dark:text-black font-bold">
            Join True Feedback
          </h1>
          <p className="text-gray-600 mt-2">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} placeholder="you@example.com" />
                  <p className="text-xs text-gray-400 mt-1">
                    We’ll send you a verification code.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} placeholder="••••••••" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full flex justify-center"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  Up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text- text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
