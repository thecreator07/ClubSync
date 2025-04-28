import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { clubs } from "./clubs";
import { events } from "./events"; 
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const clubImages = pgTable("club_images", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const eventImages = pgTable("event_images", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(), 
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// Create Zod Schemas
export const clubImageSelectSchema = createSelectSchema(clubImages, {});
export const clubImageInsertSchema = createInsertSchema(clubImages, {});
export const clubImageUpdateSchema = createUpdateSchema(clubImages, {});

export const eventImageSelectSchema = createSelectSchema(eventImages, {});
export const eventImageInsertSchema = createInsertSchema(eventImages, {});
export const eventImageUpdateSchema = createUpdateSchema(eventImages, {});
