
import { pgTable, serial, varchar, text, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { members } from "./participation";
import { relations } from "drizzle-orm";
import { events } from "./events";
import { clubImages } from "./images";
import { z } from "zod";

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(), // for URL like /clubs/robotics-club
  description: text("description").notNull(),
  about: text("about").notNull(),
  contactEmail: varchar("contact_email", { length: 100 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  createdAt: date("created_at").defaultNow()
});


export const clubSelectSchema = createSelectSchema(clubs, {})
export const clubInsertSchema = createInsertSchema(clubs, {})
export const clubUpdateSchema = createUpdateSchema(clubs, {})


export const clubsRelations = relations(clubs, ({ many, one }) => ({
  members: many(members),
  eventsOrganized: many(events),
  clubImages: many(clubImages),
}));

export type Club = z.infer<typeof clubSelectSchema>;
export const clubsArraySchema=z.array(clubSelectSchema)
