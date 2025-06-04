// schema/clubs.ts
import { integer } from "drizzle-orm/gel-core";
import { pgTable, serial, varchar, text, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description").notNull(),
  about: text("about").notNull(),
  contactEmail: varchar("contact_email", { length: 100 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  createdAt: date("created_at").defaultNow()
});

export const clubSelectSchema = createSelectSchema(clubs, {

});
export const clubInsertSchema = createInsertSchema(clubs, {});
export const clubUpdateSchema = createUpdateSchema(clubs, {});

export type Club = z.infer<typeof clubSelectSchema>;
export const clubsArraySchema = z.array(clubSelectSchema);

