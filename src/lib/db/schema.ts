import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  doublePrecision,
  boolean,
  unique,
  index,
} from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  timezone: text('timezone').notNull(),
  displayName: text('display_name'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const decks = pgTable('decks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const cards = pgTable(
  'cards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    deckId: uuid('deck_id')
      .notNull()
      .references(() => decks.id, { onDelete: 'cascade' }),
    contentSource: text('content_source').notNull(),
    contentId: text('content_id').notNull(),
    contentVersion: text('content_version').notNull(),
    snapshotWord: text('snapshot_word').notNull(),
    snapshotReading: text('snapshot_reading').notNull(),
    snapshotGloss: text('snapshot_gloss').notNull(),
    due: timestamp('due', { withTimezone: true }).notNull().defaultNow(),
    stability: doublePrecision('stability').notNull().default(0),
    difficulty: doublePrecision('difficulty').notNull().default(0),
    elapsedDays: integer('elapsed_days').notNull().default(0),
    scheduledDays: integer('scheduled_days').notNull().default(0),
    learningSteps: integer('learning_steps').notNull().default(0),
    reps: integer('reps').notNull().default(0),
    lapses: integer('lapses').notNull().default(0),
    state: integer('state').notNull().default(0),
    lastReview: timestamp('last_review', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.deckId, table.contentSource, table.contentId),
    index('cards_deck_id_due_idx').on(table.deckId, table.due),
  ],
);

export const reviewLogs = pgTable(
  'review_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    cardId: uuid('card_id').references(() => cards.id, { onDelete: 'set null' }),
    rating: integer('rating').notNull(),
    state: integer('state').notNull(),
    scheduledDays: integer('scheduled_days').notNull(),
    elapsedDays: integer('elapsed_days').notNull(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('review_logs_user_id_reviewed_at_idx').on(table.userId, table.reviewedAt)],
);

export const kanaMastery = pgTable(
  'kana_mastery',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    script: text('script').notNull(),
    character: text('character').notNull(),
    correctStreak: integer('correct_streak').notNull().default(0),
    attempts: integer('attempts').notNull().default(0),
    correctCount: integer('correct_count').notNull().default(0),
    mastered: boolean('mastered').notNull().default(false),
    lastTestedAt: timestamp('last_tested_at', { withTimezone: true }),
  },
  (table) => [unique().on(table.userId, table.script, table.character)],
);

export const kanaExams = pgTable(
  'kana_exams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    script: text('script').notNull(),
    size: integer('size').notNull(),
    correctCount: integer('correct_count').notNull(),
    takenAt: timestamp('taken_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('kana_exams_user_id_taken_at_idx').on(table.userId, table.takenAt)],
);

export const sentenceMastery = pgTable(
  'sentence_mastery',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    tier: text('tier').notNull(),
    pointKey: text('point_key').notNull(),
    correctStreak: integer('correct_streak').notNull().default(0),
    mastered: boolean('mastered').notNull().default(false),
    lastTestedAt: timestamp('last_tested_at', { withTimezone: true }),
  },
  (table) => [unique().on(table.userId, table.tier, table.pointKey)],
);

export const sentenceExams = pgTable(
  'sentence_exams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    tier: text('tier').notNull(),
    correctCount: integer('correct_count').notNull(),
    total: integer('total').notNull(),
    takenAt: timestamp('taken_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('sentence_exams_user_id_taken_at_idx').on(table.userId, table.takenAt)],
);
