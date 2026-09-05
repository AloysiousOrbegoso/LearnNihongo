import { and, count, eq, gte, sql } from 'drizzle-orm';
import { State } from 'ts-fsrs';
import { db } from '@/lib/db/client';
import { cards, decks, reviewLogs } from '@/lib/db/schema';
import { formatDay, shiftDay } from '@/lib/timezone';

const DAY_MS = 86_400_000;
const HISTORY_DAYS = 14;
const STREAK_LOOKBACK_DAYS = 366;
const RETENTION_WINDOW_DAYS = 30;

export interface Stats {
  totalCards: number;
  dueNow: number;
  byState: { new: number; learning: number; review: number; relearning: number };
  reviewsToday: number;
  streakDays: number;
  retention: number | null;
  history: { day: string; count: number }[];
}

const STATE_KEYS: Record<number, keyof Stats['byState']> = {
  [State.New]: 'new',
  [State.Learning]: 'learning',
  [State.Review]: 'review',
  [State.Relearning]: 'relearning',
};

export async function getStats({
  userId,
  now,
  timezone,
}: {
  userId: string;
  now: Date;
  timezone: string;
}): Promise<Stats> {
  const dayExpr = sql<string>`to_char(${reviewLogs.reviewedAt} at time zone ${timezone}, 'YYYY-MM-DD')`;
  const nowIso = now.toISOString();

  const [stateRows, dayRows, [retentionRow]] = await Promise.all([
    db
      .select({
        state: cards.state,
        total: count(),
        due: sql<number>`count(*) filter (where ${cards.due} <= ${nowIso})`.mapWith(Number),
      })
      .from(cards)
      .innerJoin(decks, eq(cards.deckId, decks.id))
      .where(eq(decks.userId, userId))
      .groupBy(cards.state),
    db
      .select({ day: dayExpr, total: count() })
      .from(reviewLogs)
      .where(
        and(
          eq(reviewLogs.userId, userId),
          gte(reviewLogs.reviewedAt, new Date(now.getTime() - STREAK_LOOKBACK_DAYS * DAY_MS)),
        ),
      )
      .groupBy(dayExpr),
    db
      .select({
        total: count(),
        remembered: sql<number>`count(*) filter (where ${reviewLogs.rating} > 1)`.mapWith(Number),
      })
      .from(reviewLogs)
      .where(
        and(
          eq(reviewLogs.userId, userId),
          gte(reviewLogs.reviewedAt, new Date(now.getTime() - RETENTION_WINDOW_DAYS * DAY_MS)),
          gte(reviewLogs.state, State.Review),
        ),
      ),
  ]);

  const byState = { new: 0, learning: 0, review: 0, relearning: 0 };
  let totalCards = 0;
  let dueNow = 0;
  for (const row of stateRows) {
    totalCards += row.total;
    dueNow += row.due;
    const key = STATE_KEYS[row.state];
    if (key) byState[key] += row.total;
  }

  const countsByDay = new Map(dayRows.map((row) => [row.day, row.total]));
  const today = formatDay(now, timezone);

  const history: Stats['history'] = [];
  let day = today;
  for (let i = 0; i < HISTORY_DAYS; i += 1) {
    history.unshift({ day, count: countsByDay.get(day) ?? 0 });
    day = shiftDay(day, -1);
  }

  let streakDays = 0;
  let cursor = countsByDay.has(today) ? today : shiftDay(today, -1);
  while (countsByDay.has(cursor)) {
    streakDays += 1;
    cursor = shiftDay(cursor, -1);
  }

  const retention =
    retentionRow && retentionRow.total > 0 ? retentionRow.remembered / retentionRow.total : null;

  return {
    totalCards,
    dueNow,
    byState,
    reviewsToday: countsByDay.get(today) ?? 0,
    streakDays,
    retention,
    history,
  };
}
