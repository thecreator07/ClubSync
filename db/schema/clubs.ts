import { pgTable, serial, varchar, text, date } from "drizzle-orm/pg-core";

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(), // for URL like /clubs/robotics-club
  description: text("description").notNull(),
  about: text("about").notNull(),
  contactEmail: varchar("contact_email", { length: 100 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  coverImage: varchar("cover_image_url", { length: 255 }), // big banner
  logoImage: varchar("logo_image_url", { length: 255 }), // small logo
  createdAt: date("created_at").defaultNow()
});


