import { pgTable, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { clubs } from "./clubs";



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
    role: varchar("role", { length: 20 }).default("member"), // member | president
    joinedAt: timestamp("joined_at").defaultNow()
});