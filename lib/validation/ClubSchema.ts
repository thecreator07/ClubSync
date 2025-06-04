import { clubImageSelectSchema, clubSelectSchema, eventSelectSchema } from "@/db/schema&relation";
import { z } from "zod";

const clubWithImageschema = clubSelectSchema.extend({
  memberCount: z.number(),
  clubImagelist: clubImageSelectSchema,
});
export const clubWithImageArray = z.array(clubWithImageschema);

export type CLubData = z.infer<typeof clubSelectSchema>
export type EventData = z.infer<typeof eventSelectSchema>