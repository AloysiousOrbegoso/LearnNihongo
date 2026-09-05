import { getVerifiedUser } from '@/lib/auth/session';
import { deleteDeck } from '@/lib/db/queries/decks';
import { isUuid } from '@/lib/uuid';
import { notFound, ok, unauthenticated } from '@/lib/api';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const { id } = await params;
  if (!isUuid(id)) return notFound('Deck not found.');

  const deleted = await deleteDeck({ deckId: id, userId: user.id });
  if (!deleted) return notFound('Deck not found.');

  return ok({ deleted: true });
}
