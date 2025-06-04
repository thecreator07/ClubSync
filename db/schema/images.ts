import { pgTable, serial, integer, varchar, timestamp, primaryKey } from "drizzle-orm/pg-core";

import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
// import { relations } from "drizzle-orm";

export const clubImages = pgTable("club_images", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").notNull(),
  public_id: varchar("public_id", { length: 100 }).notNull(),
  imageType: varchar("image_type", { length: 50 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const eventImages = pgTable("event_images", {
  id: serial("id").primaryKey(),
  imageType: varchar("image_type", { length: 50 }).notNull(),
  eventId: integer("event_id").notNull(),
  public_id: varchar("public_id", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Create Zod Schemas
export const clubImageSelectSchema = createSelectSchema(clubImages, {});
export const clubImageInsertSchema = createInsertSchema(clubImages, {});
export const clubImageUpdateSchema = createUpdateSchema(clubImages, {});

export const eventImageSelectSchema = createSelectSchema(eventImages, {});
export const eventImageInsertSchema = createInsertSchema(eventImages, {});
export const eventImageUpdateSchema = createUpdateSchema(eventImages, {});


