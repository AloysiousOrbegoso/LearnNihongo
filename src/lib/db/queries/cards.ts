import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { cards, decks } from '@/lib/db/schema';

type AddCardResult =
  | { status: 'created'; card: typeof cards.$inferSelect }
  | { status: 'duplicate' }
  | { status: 'deck_not_found' };

async function ownsDeck({ deckId, userId }: { deckId: string; userId: string }) {
  const [deck] = await db
    .select({ id: decks.id })
    .from(decks)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)));
  return Boolean(deck);
}

export async function addCardToDeck({
  deckId,
  userId,
  contentSource,
  contentId,
  contentVersion,
  snapshotWord,
  snapshotReading,
  snapshotGloss,
}: {
  deckId: string;
  userId: string;
  contentSource: string;
  contentId: string;
  contentVersion: string;
  snapshotWord: string;
  snapshotReading: string;
  snapshotGloss: string;
}): Promise<AddCardResult> {
  if (!(await ownsDeck({ deckId, userId }))) return { status: 'deck_not_found' };

  const [card] = await db
    .insert(cards)
    .values({
      deckId,
      contentSource,
      contentId,
      contentVersion,
      snapshotWord,
      snapshotReading,
      snapshotGloss: snapshotGloss.slice(0, 120),
    })
    .onConflictDoNothing()
    .returning();

  if (!card) return { status: 'duplicate' };

  return { status: 'created', card };
}

export async function getDeckCards({ deckId, userId }: { deckId: string; userId: string }) {
  if (!(await ownsDeck({ deckId, userId }))) return null;

  return db.select().from(cards).where(eq(cards.deckId, deckId)).orderBy(asc(cards.createdAt));
}

export async function removeCard({
  cardId,
  deckId,
  userId,
}: {
  cardId: string;
  deckId: string;
  userId: string;
}) {
  if (!(await ownsDeck({ deckId, userId }))) return false;

  const deleted = await db
    .delete(cards)
    .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
    .returning({ id: cards.id });
  return deleted.length > 0;
}
