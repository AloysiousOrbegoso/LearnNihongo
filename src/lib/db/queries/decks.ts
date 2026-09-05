import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { cards, decks } from '@/lib/db/schema';

export async function createDeck({ userId, name }: { userId: string; name: string }) {
  const [deck] = await db.insert(decks).values({ userId, name }).returning();
  return deck;
}

export async function getUserDecks(userId: string) {
  return db.select().from(decks).where(eq(decks.userId, userId)).orderBy(asc(decks.createdAt));
}

export async function getUserDecksWithCounts({ userId, now }: { userId: string; now: Date }) {
  return db
    .select({
      id: decks.id,
      name: decks.name,
      createdAt: decks.createdAt,
      cardCount: sql<number>`count(${cards.id})`.mapWith(Number),
      dueCount: sql<number>`count(${cards.id}) filter (where ${cards.due} <= ${now})`.mapWith(
        Number,
      ),
    })
    .from(decks)
    .leftJoin(cards, eq(cards.deckId, decks.id))
    .where(eq(decks.userId, userId))
    .groupBy(decks.id)
    .orderBy(asc(decks.createdAt));
}

export async function getDeck({ deckId, userId }: { deckId: string; userId: string }) {
  const [deck] = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)));
  return deck ?? null;
}

export async function deleteDeck({ deckId, userId }: { deckId: string; userId: string }) {
  const deleted = await db
    .delete(decks)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)))
    .returning({ id: decks.id });
  return deleted.length > 0;
}
