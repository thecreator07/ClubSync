import { pgTable, serial, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  bannerImage: varchar("banner_image", { length: 500 }).notNull(),
  bannerDescription: varchar("banner_description", { length: 500 }).notNull(),
  createdAt: date("created_at").defaultNow().notNull(), 
});

export const bannerSelectSchema = createSelectSchema(banners, {});
export const bannerInsertSchema = createInsertSchema(banners, {});
export const bannerUpdateSchema = createUpdateSchema(banners, {});
