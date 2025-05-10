import { pgTable, serial, varchar, integer, date, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

// 1. Define a Postgres ENUM for role
export const roleEnum = pgEnum('role', ['student', 'admin', 'user']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 100 }).notNull(),
  password: varchar('password', { length: 100 }).notNull(),
  firstname: varchar('firstname', { length: 100 }),
  lastname: varchar('lastname', { length: 100 }),
  phone: varchar('phone', { length: 100 }),
  department: varchar('department', { length: 100 }),
  year: integer('year'),
  semester: integer('semester'),
  council: varchar('council', { length: 100 }),
  social: varchar('social', { length: 100 }),
  aoi: varchar('aoi', { length: 100 }),
  role: roleEnum('role').notNull().default('user'),  //global role
  idCard: varchar('id_card', { length: 100 }),
  verified: integer('verified').default(0),
  createdAt: date('created_at').defaultNow(),
  avatar: varchar('avatar', { length: 255 }),
});

// 2. Create Zod schemas with role validation

export const userSelectSchema = createSelectSchema(users, {
  role: z.enum(['student', 'admin', 'user']),
}).omit({password:true})

export const userInsertSchema = createInsertSchema(users, {
  role: z.enum(['student', 'admin', 'user']),
});

export const userUpdateSchema = createUpdateSchema(users, {
  role: z.enum(['student', 'admin', 'user']),
  password: z.string().optional(),
}).omit({ password: true });
