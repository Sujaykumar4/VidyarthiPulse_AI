import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const analysisHistory = pgTable('analysis_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  cropType: text('crop_type').notNull(),
  result: jsonb('result').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  analysisHistory: many(analysisHistory),
}));

export const analysisHistoryRelations = relations(analysisHistory, ({ one }) => ({
  user: one(users, {
    fields: [analysisHistory.userId],
    references: [users.id],
  }),
}));
