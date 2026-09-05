import { getVerifiedUser } from '@/lib/auth/session';
import { applyReview } from '@/lib/db/queries/review';
import { isGrade } from '@/lib/review/scheduler';
import { reviewRateLimit } from '@/lib/rate-limit';
import { reviewAnswerSchema } from '@/schemas/review';
import {
  fail,
  notFound,
  ok,
  rateLimited,
  readJson,
  unauthenticated,
  validationFailed,
} from '@/lib/api';

export async function POST(request: Request) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const { success } = await reviewRateLimit.limit(`review:${user.id}`);
  if (!success) return rateLimited();

  const parsed = reviewAnswerSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailed(parsed.error);

  const { cardId, rating } = parsed.data;
  if (!isGrade(rating)) return fail('VALIDATION_FAILED', 'Invalid rating.', 400);

  const card = await applyReview({ userId: user.id, cardId, grade: rating, now: new Date() });
  if (!card) return notFound('Card not found.');

  return ok({ due: card.due.toISOString(), state: card.state });
}
