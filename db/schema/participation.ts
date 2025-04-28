import { pgTable, serial, integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { clubs } from "./clubs";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

// Create Postgres ENUM for membership role
export const membershipRoleEnum = pgEnum('membership_role', ['member', 'president','vice-president']); 

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
    role: z.enum(['member', 'president','vice-president']),
});

export const memberInsertSchema = createInsertSchema(members, {
    role: z.enum(['member', 'president','vice-president']),
});

export const memberUpdateSchema = createUpdateSchema(members, {
    role: z.enum(['member', 'president','vice-president']),
});


export const eventRegistrationSelectSchema = createSelectSchema(eventRegistrations, {});
export const eventRegistrationInsertSchema = createInsertSchema(eventRegistrations, {});
export const eventRegistrationUpdateSchema = createUpdateSchema(eventRegistrations, {});
