"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";



export default function ForgotPasswordPage() {
    const router = useRouter();

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "", newPassword: "", repeatPassword: "" },
    });

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        try {
            const res = await axios.post<ApiResponse>("/api/forgot-password", {
                email: data.email,
                newPassword: data.newPassword,
            });
            toast.success("Success", {
                description: res.data.message,
                duration: 4000,
            });
            router.replace("/sign-in");
        } catch (err) {
            const error = err as AxiosError<ApiResponse>;
            toast.error("Reset Failed", {
                description: error.response?.data.message ?? "Something went wrong",
                duration: 5000,
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 border rounded-xl shadow-lg space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Forgot Password</h1>
                    <p className="text-gray-600 mt-2">
                        Enter your email and new password to reset your password.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        {...field}
                                        placeholder="you@example.com"
                                        className="text-amber-950"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="newPassword"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        placeholder="••••••••"
                                        className="text-amber-950"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="repeatPassword"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Repeat Password</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        placeholder="••••••••"
                                        className="text-amber-950"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full flex justify-center"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </Form>

                <p className="text-center text-gray-600">
                    Remembered your password?{" "}
                    <Link href="/sign-in" className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}