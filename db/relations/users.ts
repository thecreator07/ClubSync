import { relations } from "drizzle-orm";
import { eventRegistrations, members, users } from "../schema&relation";

export const usersRelations = relations(users, ({ many }) => ({
    membershiplist: many(members), // A user can have many memberships in different clubs
    eventRegistrationlist: many(eventRegistrations), // A user can register for many events
}));