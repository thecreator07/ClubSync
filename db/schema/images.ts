import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";
import { clubs } from "./clubs";

export const clubImages = pgTable("club_images", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
});

export const eventImages = pgTable("event_images", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
});