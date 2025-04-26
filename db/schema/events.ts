import { pgTable, serial, varchar, text, date, integer, timestamp } from "drizzle-orm/pg-core";
import { clubs } from "./clubs";

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


