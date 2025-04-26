import { pgTable, serial, varchar, date } from "drizzle-orm/pg-core";

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  bannerImage: varchar("banner_image", { length: 500 }).notNull(),
  bannerDescription: varchar("banner_description", { length: 500 }).notNull(),
  createdAt: date("date").defaultNow().notNull(),
});
