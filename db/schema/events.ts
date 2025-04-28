import { pgTable, serial, varchar, text, date, integer, timestamp } from "drizzle-orm/pg-core";
import { clubs } from "./clubs";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(), // Linking to the Club
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  eventDate: date("event_date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  eventImage: varchar("event_image", { length: 255 }), // For event banner
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  registrationLink: varchar("registration_link", { length: 255 }) // A link to register for the event
});


export const eventSelectSchema = createSelectSchema(events, {})
export const eventInsertSchema = createInsertSchema(events, { registrationLink: z.string().url().optional(),})
export const eventUpdateSchema = createUpdateSchema(events, { registrationLink: z.string().url().optional(),})