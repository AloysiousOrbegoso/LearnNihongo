import { and, asc, eq, lte } from 'drizzle-orm';
import type { Grade } from 'ts-fsrs';
import { db } from '@/lib/db/client';
import { cards, decks, reviewLogs } from '@/lib/db/schema';
import { previewIntervals, scheduleReview } from '@/lib/review/scheduler';

const QUEUE_LIMIT = 50;

export async function getReviewQueue({
  userId,
  deckId,
  now,
}: {
  userId: string;
  deckId?: string;
  now: Date;
}) {
  const rows = await db
    .select({ card: cards, deckName: decks.name })
    .from(cards)
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(
      and(
        eq(decks.userId, userId),
        lte(cards.due, now),
        deckId ? eq(cards.deckId, deckId) : undefined,
      ),
    )
    .orderBy(asc(cards.due), asc(cards.createdAt))
    .limit(QUEUE_LIMIT);

  return rows.map(({ card, deckName }) => ({
    id: card.id,
    deckId: card.deckId,
    deckName,
    contentSource: card.contentSource,
    contentId: card.contentId,
    word: card.snapshotWord,
    reading: card.snapshotReading,
    gloss: card.snapshotGloss,
    state: card.state,
    intervals: previewIntervals(card, now),
  }));
}

export type ReviewQueueCard = Awaited<ReturnType<typeof getReviewQueue>>[number];

export async function applyReview({
  userId,
  cardId,
  grade,
  now,
}: {
  userId: string;
  cardId: string;
  grade: Grade;
  now: Date;
}) {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .select({ card: cards })
      .from(cards)
      .innerJoin(decks, eq(cards.deckId, decks.id))
      .where(and(eq(cards.id, cardId), eq(decks.userId, userId)));

    if (!row) return null;

    const outcome = scheduleReview(row.card, grade, now);

    await tx
      .update(cards)
      .set({
        due: outcome.card.due,
        stability: outcome.card.stability,
        difficulty: outcome.card.difficulty,
        elapsedDays: outcome.card.elapsedDays,
        scheduledDays: outcome.card.scheduledDays,
        learningSteps: outcome.card.learningSteps,
        reps: outcome.card.reps,
        lapses: outcome.card.lapses,
        state: outcome.card.state,
        lastReview: outcome.card.lastReview,
      })
      .where(eq(cards.id, cardId));

    await tx.insert(reviewLogs).values({
      userId,
      cardId,
      rating: outcome.log.rating,
      state: outcome.log.state,
      scheduledDays: outcome.log.scheduledDays,
      elapsedDays: outcome.log.elapsedDays,
      reviewedAt: outcome.log.reviewedAt,
    });

    return outcome.card;
  });
}
