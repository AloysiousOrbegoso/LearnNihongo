import { getVerifiedUser } from '@/lib/auth/session';
import { addCardToDeck } from '@/lib/db/queries/cards';
import { isUuid } from '@/lib/uuid';
import { addCardSchema } from '@/schemas/decks';
import { notFound, ok, readJson, unauthenticated, validationFailed } from '@/lib/api';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const { id: deckId } = await params;
  if (!isUuid(deckId)) return notFound('Deck not found.');

  const parsed = addCardSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailed(parsed.error);

  const result = await addCardToDeck({ deckId, userId: user.id, ...parsed.data });

  if (result.status === 'deck_not_found') return notFound('Deck not found.');
  if (result.status === 'duplicate') return ok({ duplicate: true as const });

  return ok(result.card);
}
