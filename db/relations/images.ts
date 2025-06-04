import { relations } from "drizzle-orm";
import { clubImages, eventImages } from "../schema/images";
import { clubs, events } from "../schema&relation";
// import { clubs, events } from "../schema";

export const clubImagesRelations = relations(clubImages, ({ one }) => ({
    club: one(clubs, {
        fields: [clubImages.clubId],
        references: [clubs.id],
    }),
}));
export const eventImagesRelations = relations(eventImages, ({ one }) => ({
    event: one(events, {
        fields: [eventImages.eventId],
        references: [events.id],
    }),
}));
