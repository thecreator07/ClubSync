// schemas/userUpdateSchema.ts
import * as z from "zod";

export const userUpdateSchema = z.object({
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .optional(),
  department: z.string().min(2, "Department is required"),
  year: z
    .union([
      z.literal("1"),
      z.literal("2"),
      z.literal("3"),
      z.literal("4"),
    ])
    .or(z.string().regex(/^[1-4]$/, "Year must be 1, 2, 3 or 4")),
  semester: z
    .union([
      z.literal("1"),
      z.literal("2"),
      z.literal("3"),
      z.literal("4"),
      z.literal("5"),
      z.literal("6"),
      z.literal("7"),
      z.literal("8"),
    ])
    .or(z.string().regex(/^[1-8]$/, "Semester must be between 1 and 8")),
  aoi: z.string()
  //   avatar: z.string().url("Must be a valid URL").optional(),
});
