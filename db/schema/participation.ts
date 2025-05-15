import { pgTable, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { clubs } from "./clubs";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { events } from "./events";
import { relations } from "drizzle-orm";

// Create Postgres ENUM for membership role
export const membershipRoleEnum = pgEnum('membership_role', ['member', 'president', 'secretary', "treasurer"]);

export const eventRegistrations = pgTable('event_registrations', {
    id: serial('id').primaryKey(),
    eventId: integer('event_id').notNull(),
    userId: integer('user_id').notNull(),
    registeredAt: timestamp('registered_at').defaultNow(),
});

export const members = pgTable("memberships", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    clubId: integer("club_id").references(() => clubs.id).notNull(),
    role: membershipRoleEnum('role').default('member'), //club role
    joinedAt: timestamp("joined_at").defaultNow()
});

// Override role validation manually in Zod schemas:
export const memberSelectSchema = createSelectSchema(members, {
    role: z.enum(['member', 'president', 'secretary', "treasurer"]),
});

export const memberInsertSchema = createInsertSchema(members, {
    role: z.enum(['member', 'president', 'secretary', "treasurer"]),
});

export const memberUpdateSchema = createUpdateSchema(members, {
    role: z.enum(['member', 'president', 'secretary', "treasurer"]),
});


export const eventRegistrationSelectSchema = createSelectSchema(eventRegistrations, {});
export const eventRegistrationInsertSchema = createInsertSchema(eventRegistrations, {});
export const eventRegistrationUpdateSchema = createUpdateSchema(eventRegistrations, {});


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

