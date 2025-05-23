import { pgTable, serial, integer, varchar, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { clubs } from "./clubs";
import { events } from "./events";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const clubImages = pgTable("club_images", {//count only five images(hero)
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  public_id: varchar("public_id", { length: 100 }).notNull(),
  imageType: varchar("image_type", { length: 50 }).notNull(), // e.g., "thumbnail", "logo","hero"
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const eventImages = pgTable("event_images", {//clubgrphoto, winnerphto are same as eventgrphoto, winnerphto
  id: serial("id").primaryKey(),
  imageType: varchar("image_type", { length: 50 }).notNull(), // e.g., "thumbnail", "banner","grpphoto","winnerphto"
  eventId: integer("event_id").references(() => events.id).notNull(),
  public_id: varchar("public_id", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),

}, (t) => [primaryKey({ columns: [t.eventId, t.id] })]);

// Create Zod Schemas
export const clubImageSelectSchema = createSelectSchema(clubImages, {});
export const clubImageInsertSchema = createInsertSchema(clubImages, {});
export const clubImageUpdateSchema = createUpdateSchema(clubImages, {});

export const eventImageSelectSchema = createSelectSchema(eventImages, {});
export const eventImageInsertSchema = createInsertSchema(eventImages, {});
export const eventImageUpdateSchema = createUpdateSchema(eventImages, {});


// Relations for 'club_images'
export const clubImagesRelations = relations(clubImages, ({ one }) => ({
  club: one(clubs, { // Each club image belongs to one club
    fields: [clubImages.clubId],
    references: [clubs.id],
  }),
}));

// Relations for 'event_images'
export const eventImagesRelations = relations(eventImages, ({ one }) => ({
  event: one(events, { // Each event image belongs to one event
    fields: [eventImages.eventId],
    references: [events.id],
  }),
}));
