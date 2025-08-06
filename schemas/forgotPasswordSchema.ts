import { z } from "zod";

export const forgotPasswordSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        repeatPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.repeatPassword, {
        message: "Passwords do not match",
        path: ["repeatPassword"],
    });
