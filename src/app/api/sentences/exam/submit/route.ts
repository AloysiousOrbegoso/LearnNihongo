import { getVerifiedUser } from '@/lib/auth/session';
import { getTierProgress, submitExam } from '@/lib/db/queries/sentences';
import { reviewRateLimit } from '@/lib/rate-limit';
import { examSubmitSchema } from '@/schemas/sentences';
import { fail, ok, rateLimited, readJson, unauthenticated, validationFailed } from '@/lib/api';

export async function POST(request: Request) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const { success } = await reviewRateLimit.limit(`sentence-exam:${user.id}`);
  if (!success) return rateLimited();

  const parsed = examSubmitSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailed(parsed.error);

  const progress = await getTierProgress(user.id);
  if (!progress[parsed.data.tier].unlocked) return fail('FORBIDDEN', 'This tier is locked.', 403);

  const result = await submitExam({
    userId: user.id,
    tier: parsed.data.tier,
    answers: parsed.data.answers,
    now: new Date(),
  });

  if (!result)
    return fail('VALIDATION_FAILED', 'Unknown or mismatched exercise in submission.', 400);

  return ok(result);
}
