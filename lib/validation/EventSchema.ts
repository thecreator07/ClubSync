import { eventInsertSchema, eventSelectSchema } from "@/db/schema&relation";
import { z } from "zod";

export const eventselectArraySchema = z.array(eventSelectSchema)


export type EventRequestBody = z.infer<typeof eventInsertSchema>
