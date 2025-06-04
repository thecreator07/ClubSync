import { z } from "zod";



export const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstname: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
    lastname: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
})