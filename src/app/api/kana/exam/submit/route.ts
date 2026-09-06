import { getVerifiedUser } from '@/lib/auth/session';
import { submitExam } from '@/lib/db/queries/kana';
import { reviewRateLimit } from '@/lib/rate-limit';
import { examSubmitSchema } from '@/schemas/kana';
import { fail, ok, rateLimited, readJson, unauthenticated, validationFailed } from '@/lib/api';

export async function POST(request: Request) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const { success } = await reviewRateLimit.limit(`kana-exam:${user.id}`);
  if (!success) return rateLimited();

  const parsed = examSubmitSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailed(parsed.error);

  const result = await submitExam({
    userId: user.id,
    script: parsed.data.script,
    answers: parsed.data.answers,
    now: new Date(),
  });

  if (!result) return fail('VALIDATION_FAILED', 'Unknown character in submission.', 400);

  return ok(result);
}
