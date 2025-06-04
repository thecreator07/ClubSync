import { relations } from "drizzle-orm";
import { eventImages } from "../schema/images";
import { clubs, eventRegistrations, events } from "../schema&relation";

export const eventsRelations = relations(events, ({ one, many }) => ({
    organizingClub: one(clubs, { // An event is organized by one club
        fields: [events.clubId],
        references: [clubs.id],
    }),
    registrations: many(eventRegistrations), // An event can have many user registrations
    eventImagesList: many(eventImages, {
        relationName: "eventImagesList",
    }) // An event can have many images
}));
