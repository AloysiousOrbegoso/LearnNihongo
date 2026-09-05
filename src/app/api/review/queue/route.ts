import { getVerifiedUser } from '@/lib/auth/session';
import { getReviewQueue } from '@/lib/db/queries/review';
import { reviewQueueSchema } from '@/schemas/review';
import { ok, unauthenticated, validationFailed } from '@/lib/api';

export async function GET(request: Request) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const { searchParams } = new URL(request.url);
  const parsed = reviewQueueSchema.safeParse({ deckId: searchParams.get('deckId') ?? undefined });
  if (!parsed.success) return validationFailed(parsed.error);

  const now = new Date();
  const cards = await getReviewQueue({ userId: user.id, deckId: parsed.data.deckId, now });

  return ok({ cards, now: now.toISOString() });
}
