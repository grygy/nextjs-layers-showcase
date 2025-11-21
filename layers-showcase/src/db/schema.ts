import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export type DrizzleUser = typeof users.$inferSelect;
export type DrizzleUserInsert = typeof users.$inferInsert;

