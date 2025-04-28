import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  description: text("description").notNull(),
  pointsSpent: integer("points_spent").notNull(),
  redeemedAt: timestamp("redeemed_at").defaultNow()
});

export const rewardSelectSchema = createSelectSchema(rewards);
export const rewardInsertSchema = createInsertSchema(rewards);
export const rewardUpdateSchema = createUpdateSchema(rewards);
