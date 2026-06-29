import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const examPrep = pgTable('exam_prep', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  examName: text('exam_name').notNull(),
  targetDate: text('target_date').notNull(),
  badges: text('badges').array(),
});

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  examPrepId: integer('exam_prep_id')
    .references(() => examPrep.id)
    .notNull(),
  name: text('name').notNull(),
  examDate: text('exam_date'),
});

export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id')
    .references(() => subjects.id)
    .notNull(),
  name: text('name').notNull(),
  isCompleted: boolean('is_completed').default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  examPreps: many(examPrep),
}));

export const examPrepRelations = relations(examPrep, ({ one, many }) => ({
  user: one(users, { fields: [examPrep.userId], references: [users.id] }),
  subjects: many(subjects),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  examPrep: one(examPrep, { fields: [subjects.examPrepId], references: [examPrep.id] }),
  chapters: many(chapters),
}));
