import { relations } from "drizzle-orm";
import { clubImages } from "../schema/images";
import { clubs, events, members } from "../schema&relation";

export const clubsRelations = relations(clubs, ({ many }) => ({
    memberlist: many(members),
    eventsOrganized: many(events),
    clubImagelist: many(clubImages),
}));
