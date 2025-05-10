import { z } from "zod";

export const userprofileclubSchema = z.object({
    clubId: z.number(),
    clubrole: z.string(),
    clubname: z.string(),
    clubslug: z.string()
})

export const userprofileEventSchema = z.object({
    eventsId: z.number(),
    eventName: z.string(),
    eventDate: z.string()
})