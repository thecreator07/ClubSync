import { relations } from "drizzle-orm";
import { clubs, eventRegistrations, events, members, users } from "../schema&relation";

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
    event: one(events, { // Each registration belongs to one event
        fields: [eventRegistrations.eventId],
        references: [events.id],
    }),
    user: one(users, { // Each registration belongs to one user
        fields: [eventRegistrations.userId],
        references: [users.id],
    }),
}));


export const membersRelations = relations(members, ({ one }) => ({
    user: one(users, { // Each membership record belongs to one user
        fields: [members.userId],
        references: [users.id],
    }),
    club: one(clubs, { // Each membership record belongs to one club
        fields: [members.clubId],
        references: [clubs.id],
    }),
}));