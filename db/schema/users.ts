import { pgTable, serial, varchar, integer, date, timestamp } from 'drizzle-orm/pg-core';

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
  role: varchar('role', { length: 100 }),
  idCard: varchar('id_card', { length: 100 }),
  verified: integer('verified').default(0),
  createdAt: date('created_at').defaultNow(),
});
