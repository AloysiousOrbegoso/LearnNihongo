import { getVerifiedUser } from '@/lib/auth/session';
import { removeCard } from '@/lib/db/queries/cards';
import { isUuid } from '@/lib/uuid';
import { notFound, ok, unauthenticated } from '@/lib/api';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; cardId: string }> },
) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const { id: deckId, cardId } = await params;
  if (!isUuid(deckId) || !isUuid(cardId)) return notFound('Card not found.');

  const removed = await removeCard({ cardId, deckId, userId: user.id });
  if (!removed) return notFound('Card not found.');

  return ok({ removed: true });
}
