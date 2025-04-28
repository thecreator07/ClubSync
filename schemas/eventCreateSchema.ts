// schemas/eventCreateSchema.ts
import * as z from "zod";

export const eventCreateSchema = z.object({
  clubId: z.string().min(1, "Club is required"),
  name: z.string().min(3, "Event name is required"),
  description: z.string().min(10, "Description must be longer"),
  eventDate: z.string().min(1, "Event date is required"), // ISO Date string
  startTime: z.string().min(1, "Start time is required"), // ISO Datetime string
  endTime: z.string().min(1, "End time is required"), // ISO Datetime string
//   eventImage: z.string().url("Must be a valid URL").optional(),
  location: z.string().min(2, "Location is required"),
  registrationLink: z.string().url("Must be a valid URL").optional(),
});
