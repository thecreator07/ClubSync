import { relations } from "drizzle-orm";
import { users } from "./users";
import { eventRegistrations, members } from "./participation";
import { clubs } from "./clubs";
import { events } from "./events";
import { clubImages, eventImages } from "./images";



export const usersRelations = relations(users, ({ many }) => ({
    membershiplist: many(members), // A user can have many memberships in different clubs
    eventRegistrationlist: many(eventRegistrations), // A user can register for many events
}));


export const clubsRelations = relations(clubs, ({ many }) => ({
    memberlist: many(members),
    eventsOrganized: many(events),
    clubImagelist: many(clubImages),
}));

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



// Relations for the 'memberships' join table
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

